#!/usr/bin/env node
/**
 * Lightweight FSD boundary checks (no eslint plugin).
 * Fails on: upward layer imports, deep slice internals, cross-entity without @x.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const LAYER_RANK = Object.fromEntries(LAYERS.map((l, i) => [l, i]));

const IMPORT_RE =
  /from\s+['"](@\/[^'"]+|(\.\.\/)+[^'"]+)['"]/g;

/** @type {string[]} */
const errors = [];

function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) files.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts')) files.push(p);
  }
  return files;
}

/**
 * @param {string} absPath
 * @returns {{ layer: string | null, slice: string | null, rest: string }}
 */
function locate(absPath) {
  const rel = relative(ROOT, absPath).replaceAll('\\', '/');
  const parts = rel.split('/');
  const layer = parts[0];
  if (!LAYERS.includes(layer)) return { layer: null, slice: null, rest: rel };
  // pages may be pages/admin/books → slice = admin/books (group + page)
  if (layer === 'pages' && (parts[1] === 'admin' || parts[1] === 'panel')) {
    return { layer, slice: `${parts[1]}/${parts[2] ?? ''}`, rest: parts.slice(3).join('/') };
  }
  if (layer === 'shared') {
    return { layer, slice: parts[1] ?? null, rest: parts.slice(2).join('/') };
  }
  if (layer === 'app') {
    return { layer, slice: parts[1] ?? null, rest: parts.slice(2).join('/') };
  }
  return { layer, slice: parts[1] ?? null, rest: parts.slice(2).join('/') };
}

/**
 * Resolve @/ alias or relative import to src-relative path (no extension).
 * @param {string} fromFile
 * @param {string} spec
 */
function resolveImport(fromFile, spec) {
  if (spec.startsWith('@/')) return spec.slice(2);
  // relative
  const fromDir = join(fromFile, '..');
  const resolved = join(fromDir, spec);
  return relative(ROOT, resolved).replaceAll('\\', '/');
}

/**
 * @param {string} importerRel  path under src
 * @param {string} importedRel  path under src (no ext)
 */
function checkImport(importerRel, importedRel, spec) {
  const from = locate(join(ROOT, importerRel));
  const toParts = importedRel.replace(/\.(ts|tsx)$/, '').split('/');
  const toLayer = toParts[0];
  if (!LAYERS.includes(toLayer) || !from.layer) return;

  const fromRank = LAYER_RANK[from.layer];
  const toRank = LAYER_RANK[toLayer];

  // Upward import (lower layer importing higher)
  if (toRank < fromRank) {
    errors.push(
      `${importerRel}: upward import of ${toLayer} via '${spec}' (from ${from.layer})`,
    );
    return;
  }

  // Cross-entity: only allow @x/<consumer>
  if (from.layer === 'entities' && toLayer === 'entities') {
    const fromSlice = from.slice;
    const toSlice = toParts[1];
    if (fromSlice && toSlice && fromSlice !== toSlice) {
      const isX = toParts[2] === '@x' && toParts[3] === fromSlice;
      if (!isX) {
        errors.push(
          `${importerRel}: cross-entity import '${spec}' — use @/entities/${toSlice}/@x/${fromSlice}`,
        );
      }
    }
    return;
  }

  // Same-layer features/widgets must not import each other
  if (
    from.layer === toLayer &&
    (toLayer === 'features' || toLayer === 'widgets') &&
    from.slice &&
    toParts[1] &&
    from.slice !== toParts[1]
  ) {
    errors.push(
      `${importerRel}: cross-slice ${toLayer} import '${spec}' (no same-layer coupling)`,
    );
    return;
  }

  // Deep imports into another slice (layer/slice/segment/...)
  // Allowed: @/layer/slice  OR  @/entities/x/@x/y  OR same-slice internals
  if (toLayer === 'shared') {
    // shared: prefer segment public API (@/shared/ui) not file deep paths
    // allow @/shared/<segment> and @/shared/<segment>/... only if same segment? 
    // Flag deep file imports: @/shared/ui/button, @/shared/lib/cn
    if (toParts.length > 2) {
      // same-layer shared may import other segments' internals in practice;
      // only flag when importer is NOT shared, or when it's a known deep path pattern
      if (from.layer !== 'shared' || (from.slice && from.slice !== toParts[1])) {
        // For cross-segment within shared, deep is discouraged but not hard-fail
        // Hard-fail only for non-shared importers using deep shared paths
        if (from.layer !== 'shared') {
          errors.push(
            `${importerRel}: deep shared import '${spec}' — use @/shared/${toParts[1]}`,
          );
        }
      }
    }
    return;
  }

  if (toLayer === 'app') return; // app is top; rarely imported

  // pages / widgets / features / entities public API is layer/slice (or pages/group/slice)
  let allowedPrefixLen = 2; // layer/slice
  if (toLayer === 'pages' && (toParts[1] === 'admin' || toParts[1] === 'panel')) {
    allowedPrefixLen = 3;
  }
  // @x exception already handled for entities

  const sameSlice =
    from.layer === toLayer &&
    from.slice &&
    (toLayer === 'pages'
      ? from.slice === `${toParts[1]}/${toParts[2] ?? ''}` || from.slice === toParts[1]
      : from.slice === toParts[1]);

  if (sameSlice) return; // internals OK within own slice

  if (toParts.length > allowedPrefixLen) {
    // allow entities/*/ @x /*
    if (toLayer === 'entities' && toParts[2] === '@x') return;
    errors.push(
      `${importerRel}: deep slice import '${spec}' — use public API index`,
    );
  }
}

const files = walk(ROOT);
for (const file of files) {
  const rel = relative(ROOT, file).replaceAll('\\', '/');
  const src = readFileSync(file, 'utf8');
  for (const match of src.matchAll(IMPORT_RE)) {
    const spec = match[1];
    if (!spec.startsWith('@/') && !spec.startsWith('.')) continue;
    // skip type-only path noise; still check all imports
    let importedRel;
    try {
      importedRel = resolveImport(file, spec);
    } catch {
      continue;
    }
    // only care about imports that land under src
    if (importedRel.startsWith('..')) continue;
    checkImport(rel, importedRel, spec);
  }
}

if (errors.length) {
  console.error(`FSD check failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`FSD check passed (${files.length} files).`);

import { z } from 'zod';

/** Coerce form string/number inputs to number (Zod 4 friendly). */
export const zNum = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number(),
);

export const zNumOptional = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().optional(),
);

export const zInt = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().int(),
);

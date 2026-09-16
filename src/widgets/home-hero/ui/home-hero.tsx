import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { BeamsBackground } from '@/shared/ui';
import { Button } from '@/shared/ui';

const MARQUEE_KEYS = [
  'catalog.categories',
  'home.featured',
  'home.recentlyViewed',
  'catalog.sortNewest',
  'book.reviews',
  'nav.favorites',
] as const;

function MarqueeStrip() {
  const { t, i18n } = useTranslation();
  const words = MARQUEE_KEYS.map((key) => t(key));
  const doubled = [...words, ...words];
  const isRtl = i18n.dir() === 'rtl';

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-4 overflow-hidden opacity-50 md:top-6"
    >
      <motion.div
        className="flex w-max gap-8 whitespace-nowrap px-4 text-sm font-semibold uppercase tracking-[0.35em] text-fiery-terracotta-700/80 md:text-base dark:text-light-gold-300/80"
        animate={{ x: isRtl ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Number.POSITIVE_INFINITY }}
        style={{
          textShadow: '0 0 18px rgb(251 115 4 / 0.25), 0 1px 2px rgb(0 0 0 / 0.2)',
        }}
      >
        {doubled.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-flex items-center gap-8 after:content-['·'] after:opacity-40"
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function WarmOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -start-16 top-8 h-44 w-44 rounded-full bg-fiery-terracotta-400/25 blur-3xl dark:bg-fiery-terracotta-500/20"
        animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
        transition={{ duration: 9, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute -end-10 bottom-10 h-52 w-52 rounded-full bg-sandy-brown-300/30 blur-3xl dark:bg-sandy-brown-400/20"
        animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
        transition={{
          duration: 11,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
          delay: 0.4,
        }}
      />
      <motion.div
        className="absolute start-1/3 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-light-gold-300/25 blur-3xl dark:bg-vanilla-custard-400/15"
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{
          duration: 8,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
          delay: 0.8,
        }}
      />
      {/* soft floating book silhouettes */}
      <motion.div
        className="absolute end-[12%] top-[22%] hidden h-16 w-12 rotate-12 rounded-sm border border-sandy-brown-400/40 bg-gradient-to-br from-vanilla-custard-100/70 to-sandy-brown-200/50 shadow-md md:block dark:from-light-gold-900/40 dark:to-sandy-brown-800/40"
        animate={{ y: [0, -14, 0], rotate: [12, 8, 12] }}
        transition={{ duration: 7, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute start-[10%] bottom-[24%] hidden h-20 w-14 -rotate-6 rounded-sm border border-fiery-terracotta-300/40 bg-gradient-to-br from-fiery-terracotta-100/60 to-light-gold-200/50 shadow-md md:block dark:from-fiery-terracotta-900/50 dark:to-light-gold-900/30"
        animate={{ y: [0, 12, 0], rotate: [-6, -2, -6] }}
        transition={{
          duration: 8.5,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
          delay: 0.5,
        }}
      />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HomeHero() {
  const { t } = useTranslation();

  return (
    <BeamsBackground
      intensity="strong"
      tone="warm"
      className="min-h-[28rem] rounded-xl border border-sandy-brown-200/50 shadow-sm md:min-h-[32rem] dark:border-sandy-brown-800/40"
    >
      {/* warm wash — hero-only terracotta / sand / gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fiery-terracotta-100/55 via-vanilla-custard-50/40 to-sandy-brown-100/50 dark:from-fiery-terracotta-950/50 dark:via-light-gold-950/30 dark:to-sandy-brown-950/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(251_115_4_/_0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgb(223_175_32_/_0.14),_transparent_50%)]"
      />

      <WarmOrbs />
      <MarqueeStrip />

      <div className="relative flex min-h-[28rem] flex-col items-center justify-center gap-6 px-6 py-16 text-center md:min-h-[32rem] md:px-12">
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-5xl dark:text-white"
          style={{
            textShadow:
              '0 1px 2px rgb(0 0 0 / 0.3), 0 0 40px rgb(251 115 4 / 0.12), 0 0 80px rgb(223 175 32 / 0.15)',
          }}
        >
          {t('home.heroTitle')}
        </motion.h1>

        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-xl text-base text-foreground/85 md:text-lg dark:text-white/85"
          style={{ textShadow: '0 1px 2px rgb(0 0 0 / 0.35)' }}
        >
          {t('home.heroSubtitle')}
        </motion.p>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
          <Button asChild size="lg" className="bg-primary text-white shadow-md hover:bg-primary/90">
            <Link to="/catalog">{t('home.browseAll')}</Link>
          </Button>
        </motion.div>
      </div>
    </BeamsBackground>
  );
}

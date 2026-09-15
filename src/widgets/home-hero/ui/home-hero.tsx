import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { BeamsBackground } from '@/shared/ui/beams-background';
import { Button } from '@/shared/ui';

const MARQUEE_WORDS = [
  'Innovation',
  'Excellence',
  'Quality',
  'Precision',
  'Craft',
  'Detail',
  'Vision',
  'Impact',
] as const;

function MarqueeStrip() {
  const doubled = [...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-4 overflow-hidden opacity-40 md:top-6"
    >
      <motion.div
        className="flex w-max gap-8 whitespace-nowrap px-4 text-sm font-semibold uppercase tracking-[0.35em] text-foreground/80 md:text-base dark:text-white/70"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Number.POSITIVE_INFINITY }}
        style={{
          textShadow: '0 0 18px rgb(100 160 200 / 0.35), 0 1px 2px rgb(0 0 0 / 0.25)',
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

export function HomeHero() {
  const { t } = useTranslation();

  return (
    <BeamsBackground
      intensity="strong"
      className="min-h-[28rem] rounded-2xl border border-border/60 shadow-sm md:min-h-[32rem]"
    >
      <MarqueeStrip />

      <div className="relative flex min-h-[28rem] flex-col items-center justify-center gap-6 px-6 py-16 text-center md:min-h-[32rem] md:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-5xl dark:text-white"
          style={{
            textShadow:
              '0 1px 2px rgb(0 0 0 / 0.35), 0 0 40px rgb(255 255 255 / 0.15), 0 0 80px hsl(200 80% 60% / 0.2)',
          }}
        >
          {t('home.heroTitle')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: 'easeOut' }}
          className="max-w-xl text-base text-foreground/85 md:text-lg dark:text-white/85"
          style={{ textShadow: '0 1px 2px rgb(0 0 0 / 0.4)' }}
        >
          {t('home.heroSubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: 'easeOut' }}
        >
          <Button asChild size="lg" className="shadow-md">
            <Link to="/catalog">{t('home.browseAll')}</Link>
          </Button>
        </motion.div>
      </div>
    </BeamsBackground>
  );
}

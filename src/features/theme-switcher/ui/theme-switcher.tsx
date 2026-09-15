import { Moon, Sun, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { THEMES, type ThemeName } from '@/shared/config';
import { usePreferences } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui';

export function ThemeSwitcher() {
  const { t, i18n } = useTranslation();
  const theme = usePreferences((s) => s.theme);
  const mode = usePreferences((s) => s.mode);
  const setTheme = usePreferences((s) => s.setTheme);
  const toggleMode = usePreferences((s) => s.toggleMode);
  const isFa = i18n.language === 'fa';

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label={t('theme.mode')} onClick={toggleMode}>
        {mode === 'dark' ? <Sun /> : <Moon />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t('theme.theme')}>
            <Palette />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('theme.theme')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {THEMES.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => setTheme(item.id as ThemeName)}
              className={theme === item.id ? 'bg-accent' : undefined}
            >
              {isFa ? item.labelFa : item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

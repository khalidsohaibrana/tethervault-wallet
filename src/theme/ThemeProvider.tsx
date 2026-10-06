import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { lightPalette, darkPalette, type Palette } from './palettes';
import { fonts, typography, spacing, radii, layout } from './tokens';

/**
 * Theme system.
 *
 * - Follows the OS light/dark appearance by default.
 * - Call setMode()/toggleMode() at runtime to explicitly override the OS mode.
 * - Both palettes share identical token names, so a theme is just a palette
 *   swap — no component touches raw colors.
 */
export type ThemeMode = 'light' | 'dark';

const palettes: Record<ThemeMode, Palette> = {
  light: lightPalette,
  dark: darkPalette,
};

export interface Theme {
  mode: ThemeMode;
  colors: Palette;
  fonts: typeof fonts;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  layout: typeof layout;
}

interface ThemeContextValue extends Theme {
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}) {
  const systemMode = useColorScheme();
  const [overrideMode, setMode] = useState<ThemeMode | null>(initialMode ?? null);
  const mode: ThemeMode = overrideMode ?? (systemMode === 'dark' ? 'dark' : 'light');
  const toggleMode = useCallback(() => setMode((m) => {
    const currentMode = m ?? (systemMode === 'dark' ? 'dark' : 'light');
    return currentMode === 'light' ? 'dark' : 'light';
  }), [systemMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: palettes[mode],
      fonts,
      typography,
      spacing,
      radii,
      layout,
      setMode,
      toggleMode,
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

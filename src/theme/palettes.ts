/**
 * Color palettes. Both themes expose the SAME token names, so components
 * reference semantic tokens (e.g. `colors.textPrimary`) and never raw hex.
 * Adding/adjusting a theme means editing only this file.
 *
 * The `light` palette is extracted verbatim from the v2 prototype.
 * The `dark` palette is a first-pass mapping of the same tokens; tune freely.
 */

export interface Palette {
  // Brand
  brand: string;
  brandPressed: string;
  brandTint: string;
  brandTintPressed: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;

  // Backgrounds / surfaces
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;

  // Borders / interaction
  border: string;
  borderStrong: string;
  pressed: string;
  disabledBg: string;

  // Status
  success: string;
  successTint: string;
  error: string;

  // Token brand colors (chain/token identity — same across themes)
  usdt: string;
  ethereum: string;
  bitcoin: string;
  tron: string;

  // Fixed
  white: string;
  black: string;
}

export const lightPalette: Palette = {
  brand: '#26A17B',
  brandPressed: '#1E8062',
  brandTint: 'rgba(38,161,123,0.14)',
  brandTintPressed: 'rgba(30,128,98,0.16)',

  textPrimary: '#101414',
  textSecondary: 'rgba(16,20,20,0.62)',
  textDisabled: 'rgba(16,20,20,0.32)',

  bgPrimary: '#FFFFFF',
  bgSecondary: '#F5FAF8',
  bgTertiary: 'rgba(255,255,255,0.75)',

  border: '#DDEAE5',
  borderStrong: '#BFD7CD',
  pressed: 'rgba(0,0,0,0.08)',
  disabledBg: 'rgba(0,0,0,0.06)',

  success: '#27AE60',
  successTint: 'rgba(39,174,96,0.12)',
  error: '#E5484D',

  usdt: '#26A17B',
  ethereum: '#627EEA',
  bitcoin: '#F7931A',
  tron: '#FF060A',

  white: '#FFFFFF',
  black: '#171717',
};

export const darkPalette: Palette = {
  brand: '#26D09D',
  brandPressed: '#20A87F',
  brandTint: 'rgba(38,208,157,0.18)',
  brandTintPressed: 'rgba(32,168,127,0.18)',

  textPrimary: '#F5F5F5',
  textSecondary: 'rgba(245,245,245,0.6)',
  textDisabled: 'rgba(245,245,245,0.3)',

  bgPrimary: '#0E0E10',
  bgSecondary: '#18181B',
  bgTertiary: 'rgba(24,24,27,0.75)',

  border: '#27272A',
  borderStrong: '#3F3F46',
  pressed: 'rgba(255,255,255,0.08)',
  disabledBg: 'rgba(255,255,255,0.06)',

  success: '#34C759',
  successTint: 'rgba(52,199,89,0.14)',
  error: '#FF6B6B',

  usdt: '#26A17B',
  ethereum: '#627EEA',
  bitcoin: '#F7931A',
  tron: '#FF060A',

  white: '#FFFFFF',
  black: '#000000',
};

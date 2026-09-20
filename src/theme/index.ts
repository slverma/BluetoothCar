import { TextStyle, useColorScheme, ViewStyle } from 'react-native';

// Material 3 design tokens, mirrored from the "Bluetooth Car Controller"
// design system. Every color, size and text style in the UI should come from
// here rather than being hand-picked.

const light = {
  primary: '#375dfb',
  onPrimary: '#ffffff',
  primaryContainer: '#dde1ff',
  onPrimaryContainer: '#001257',
  secondary: '#565e71',
  secondaryContainer: '#dae2f9',
  onSecondaryContainer: '#131c2b',
  success: '#146c2e',
  onSuccess: '#ffffff',
  successContainer: '#a6f5ad',
  onSuccessContainer: '#002106',
  warning: '#7d5700',
  onWarning: '#ffffff',
  warningContainer: '#ffdea6',
  onWarningContainer: '#271900',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#410002',
  surface: '#fcfcff',
  surfaceContainerLow: '#f6f6fa',
  surfaceContainer: '#f0f0f4',
  surfaceContainerHigh: '#eaeaee',
  surfaceContainerHighest: '#e4e4e8',
  onSurface: '#1b1b1f',
  onSurfaceVariant: '#45464f',
  outline: '#767680',
  outlineVariant: '#c6c6d0',
  scrim: 'rgba(0, 0, 0, 0.5)',
  disabledScrim: 'rgba(252, 252, 255, 0.66)',
};

export type Colors = typeof light;

const dark: Colors = {
  primary: '#b7c4ff',
  onPrimary: '#002c8a',
  primaryContainer: '#1b3399',
  onPrimaryContainer: '#dde1ff',
  secondary: '#bfc6dc',
  secondaryContainer: '#3e4759',
  onSecondaryContainer: '#dae2f9',
  success: '#7dda92',
  onSuccess: '#00390f',
  successContainer: '#00531d',
  onSuccessContainer: '#a6f5ad',
  warning: '#fbbe57',
  onWarning: '#422c00',
  warningContainer: '#5f4200',
  onWarningContainer: '#ffdea6',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  surface: '#131316',
  surfaceContainerLow: '#1b1b1f',
  surfaceContainer: '#1f1f23',
  surfaceContainerHigh: '#292a2e',
  surfaceContainerHighest: '#333438',
  onSurface: '#e4e2e6',
  onSurfaceVariant: '#c6c6d0',
  outline: '#90909a',
  outlineVariant: '#45464f',
  scrim: 'rgba(0, 0, 0, 0.5)',
  disabledScrim: 'rgba(19, 19, 22, 0.66)',
};

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

// Android's 4dp grid.
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 80,
} as const;

// Material 3 shape scale. `shape-full` (circles, stadium buttons) is not here:
// a huge borderRadius can render as a distorted polygon on some Android
// devices, so round controls use `fullRadius` with their real height instead.
export const shape = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
} as const;

export const fullRadius = (height: number) => height / 2;

// Material 3 elevation levels 1-3 (1dp, 3dp, 6dp).
export const elevation: Record<1 | 2 | 3, ViewStyle> = {
  1: { elevation: 1, shadowColor: '#000' },
  2: { elevation: 3, shadowColor: '#000' },
  3: { elevation: 6, shadowColor: '#000' },
};

export const state = {
  pressed: 0.1,
  disabledContent: 0.38,
  disabledContainer: 0.12,
} as const;

// Material 3 type scale. Roboto is Android's system font, so no family is set.
export const typography: Record<
  | 'displayMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall',
  TextStyle
> = {
  displayMedium: { fontSize: 45, lineHeight: 52, fontWeight: '700' },
  headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '700' },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
};

const parseHex = (hex: string): [number, number, number] => {
  const digits = hex.replace('#', '');
  const full =
    digits.length === 3
      ? digits
          .split('')
          .map(d => d + d)
          .join('')
      : digits;
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
};

// `color` at partial opacity, for tints over a transparent surface.
export function withAlpha(color: string, alpha: number): string {
  const [r, g, b] = parseHex(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Material state layer: the control's own on-color drawn over its fill at
// `state.pressed` opacity. Returned as a flat color so the pressed look needs
// no extra overlay view.
export function stateLayer(
  fill: string,
  onColor: string,
  opacity: number = state.pressed,
): string {
  const [fr, fg, fb] = parseHex(fill);
  const [or, og, ob] = parseHex(onColor);
  const mix = (base: number, top: number) =>
    Math.round(base + (top - base) * opacity);
  return `rgb(${mix(fr, or)}, ${mix(fg, og)}, ${mix(fb, ob)})`;
}

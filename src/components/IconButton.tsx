import React, { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import {
  elevation,
  fullRadius,
  stateLayer,
  state,
  useColors,
  withAlpha,
} from '../theme';

type IconButtonProps = {
  // ghost: bare icon on a surface. filled: the one primary action on screen.
  // tonal: a secondary action inside an already filled surface.
  variant: 'ghost' | 'filled' | 'tonal';
  // Fill for the `filled` variant: primary before the action completes,
  // success once it has.
  tone?: 'primary' | 'success';
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  // Receives the on-color to draw the icon in.
  children: (contentColor: string) => ReactNode;
};

const DEFAULT_SIZE = { ghost: 44, filled: 56, tonal: 44 } as const;

export default function IconButton({
  variant,
  tone = 'primary',
  size = DEFAULT_SIZE[variant],
  onPress,
  disabled,
  accessibilityLabel,
  children,
}: IconButtonProps) {
  const c = useColors();

  let fill: string | null = null;
  let onColor = c.onSurface;
  if (variant === 'filled') {
    fill = tone === 'success' ? c.success : c.primary;
    onColor = tone === 'success' ? c.onSuccess : c.onPrimary;
  } else if (variant === 'tonal') {
    fill = c.primaryContainer;
    onColor = c.onPrimaryContainer;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: fullRadius(size) },
        {
          backgroundColor: fill
            ? pressed
              ? stateLayer(fill, onColor)
              : fill
            : pressed
            ? withAlpha(onColor, state.pressed)
            : 'transparent',
        },
        variant === 'filled' && elevation[2],
      ]}
    >
      {children(onColor)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import {
  elevation,
  fullRadius,
  stateLayer,
  state,
  typography,
  useColors,
  withAlpha,
} from '../theme';

type ButtonProps = {
  label: string;
  tone: 'error' | 'success';
  onPress: () => void;
  accessibilityLabel?: string;
};

const HEIGHT = 48;

// Full-width Material 3 filled stadium button (the Settings sheet actions).
// Success buttons sit at elevation 1; error stays flat.
export function Button({
  label,
  tone,
  onPress,
  accessibilityLabel,
}: ButtonProps) {
  const c = useColors();
  const fill = tone === 'error' ? c.error : c.success;
  const onColor = tone === 'error' ? c.onError : c.onSuccess;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.filled,
        { backgroundColor: pressed ? stateLayer(fill, onColor) : fill },
        tone === 'success' && elevation[1],
      ]}
    >
      <Text style={[typography.labelLarge, { color: onColor }]}>{label}</Text>
    </Pressable>
  );
}

// Small outlined error button for inline list rows (Disconnect).
export function OutlinedButton({
  label,
  onPress,
  accessibilityLabel,
}: Omit<ButtonProps, 'tone'>) {
  const c = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.outlined,
        {
          borderColor: c.error,
          backgroundColor: pressed
            ? withAlpha(c.error, state.pressed)
            : 'transparent',
        },
      ]}
    >
      <Text
        style={[typography.labelLarge, styles.outlinedText, { color: c.error }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filled: {
    height: HEIGHT,
    borderRadius: fullRadius(HEIGHT),
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    // 6 + 16 (text line) + 6 padding, plus the 1px border on each side.
    borderRadius: fullRadius(30),
    borderWidth: 1,
  },
  outlinedText: {
    fontSize: 12,
    lineHeight: 16,
  },
});

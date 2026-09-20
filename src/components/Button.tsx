import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Icon, { IconName } from '../icons/Icon';
import {
  elevation,
  fullRadius,
  space,
  stateLayer,
  state,
  typography,
  useColors,
  withAlpha,
} from '../theme';

type ButtonProps = {
  label: string;
  tone: 'error' | 'success';
  // Optional leading icon, drawn in the button's on-color.
  icon?: IconName;
  onPress: () => void;
  accessibilityLabel?: string;
};

const HEIGHT = 48;
const ICON_SIZE = 18;
// A label that doesn't fit shrinks to label-medium (12/14) rather than wrap.
const LABEL_MIN_SCALE = 12 / 14;

// Material 3 filled stadium button (the Settings sheet actions). Meant to share
// a row with one other, so it takes an equal share of the width. Success
// buttons sit at elevation 1; error stays flat.
export function Button({
  label,
  tone,
  icon,
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
      {icon && <Icon name={icon} size={ICON_SIZE} color={onColor} />}
      <Text
        style={[typography.labelLarge, styles.label, { color: onColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={LABEL_MIN_SCALE}
      >
        {label}
      </Text>
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
    flex: 1,
    height: HEIGHT,
    paddingHorizontal: space[2],
    borderRadius: fullRadius(HEIGHT),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
  // Lets the label shrink (see adjustsFontSizeToFit) instead of pushing the
  // icon out of a narrow button.
  label: {
    flexShrink: 1,
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

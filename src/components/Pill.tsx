import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { fullRadius, space, stateLayer, typography, useColors } from '../theme';

type PillProps = {
  label: string;
  onPress: () => void;
  // Receives the on-color to draw the icon in.
  renderIcon: (contentColor: string) => ReactNode;
};

const HEIGHT = 36;

// Material 3 tonal stadium button.
export default function Pill({ label, onPress, renderIcon }: PillProps) {
  const c = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: pressed
            ? stateLayer(c.primaryContainer, c.onPrimaryContainer)
            : c.primaryContainer,
        },
      ]}
    >
      {renderIcon(c.onPrimaryContainer)}
      <Text style={[typography.labelLarge, { color: c.onPrimaryContainer }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: HEIGHT,
    paddingHorizontal: space[4],
    borderRadius: fullRadius(HEIGHT),
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
});

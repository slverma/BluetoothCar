import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon, { IconName } from '../icons/Icon';
import {
  elevation,
  fullRadius,
  shape,
  space,
  stateLayer,
  typography,
  useColors,
} from '../theme';

type ThemeCardProps = {
  label: string;
  description: string;
  icon: IconName;
  selected: boolean;
  onPress: () => void;
};

const CHECK_SIZE = 24;

// Elevated card in the Settings theme picker. Selecting one fills it primary.
export default function ThemeCard({
  label,
  description,
  icon,
  selected,
  onPress,
}: ThemeCardProps) {
  const c = useColors();
  const fill = selected ? c.primary : c.surfaceContainerHigh;
  const titleColor = selected ? c.onPrimary : c.onSurface;
  const descriptionColor = selected ? c.onPrimary : c.onSurfaceVariant;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? stateLayer(fill, titleColor) : fill,
        },
        elevation[selected ? 2 : 1],
      ]}
    >
      {selected && (
        <View style={[styles.check, { backgroundColor: c.onPrimary }]}>
          <Icon name="check" size={16} color={c.primary} />
        </View>
      )}
      <View style={styles.icon}>
        <Icon name={icon} size={40} color={titleColor} />
      </View>
      <Text
        style={[typography.titleMedium, styles.title, { color: titleColor }]}
      >
        {label}
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          styles.description,
          { color: descriptionColor },
        ]}
      >
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    paddingVertical: space[5],
    paddingHorizontal: space[4],
    borderRadius: shape.md,
    alignItems: 'center',
  },
  check: {
    position: 'absolute',
    top: space[2],
    right: space[2],
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: fullRadius(CHECK_SIZE),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: space[2],
  },
  title: {
    marginBottom: space[1],
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});

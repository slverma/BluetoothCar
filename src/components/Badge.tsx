import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { shape, typography, useColors } from '../theme';

type BadgeProps = {
  kind: 'CLASSIC' | 'BLE';
};

// Device-type tag shown beside a device name.
export default function Badge({ kind }: BadgeProps) {
  const c = useColors();
  const classic = kind === 'CLASSIC';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: classic ? c.warningContainer : c.primaryContainer },
      ]}
    >
      <Text
        style={[
          typography.labelSmall,
          { color: classic ? c.onWarningContainer : c.onPrimaryContainer },
        ]}
      >
        {kind}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: shape.sm,
  },
});

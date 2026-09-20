import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import Icon, { IconName } from '../icons/Icon';
import {
  elevation,
  fullRadius,
  stateLayer,
  typography,
  useColors,
} from '../theme';

type CircleButtonProps = {
  size: number;
  icon: IconName;
  iconSize: number;
  iconStrokeWidth?: number;
  label: string;
  labelStyle: 'labelMedium' | 'labelSmall';
  fill: string;
  onColor: string;
  elevationLevel: 1 | 2;
  // Drawn over the fill while pressed (used by the tap/hold utility buttons;
  // the drive buttons swap fill instead).
  pressedLayer?: boolean;
  scale?: number;
  gap: number;
  onPress?: () => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
};

function CircleButton({
  size,
  icon,
  iconSize,
  iconStrokeWidth,
  label,
  labelStyle,
  fill,
  onColor,
  elevationLevel,
  pressedLayer,
  scale,
  gap,
  onPress,
  onPressIn,
  onPressOut,
}: CircleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: fullRadius(size),
          gap,
          backgroundColor:
            pressedLayer && pressed ? stateLayer(fill, onColor) : fill,
        },
        elevation[elevationLevel],
        scale !== undefined && { transform: [{ scale }] },
      ]}
    >
      <Icon
        name={icon}
        size={iconSize}
        color={onColor}
        strokeWidth={iconStrokeWidth}
      />
      <Text style={[typography[labelStyle], { color: onColor }]}>{label}</Text>
    </Pressable>
  );
}

type PressProps = Pick<
  CircleButtonProps,
  'onPress' | 'onPressIn' | 'onPressOut'
>;

// Horizontal theme steering. Tonal at rest, success while held.
export function SteeringButton({
  direction,
  active,
  ...press
}: PressProps & { direction: 'left' | 'right'; active: boolean }) {
  const c = useColors();
  return (
    <CircleButton
      {...press}
      size={88}
      icon={direction === 'left' ? 'arrow-left' : 'arrow-right'}
      iconSize={30}
      label={direction === 'left' ? 'LEFT' : 'RIGHT'}
      labelStyle="labelMedium"
      fill={active ? c.success : c.secondaryContainer}
      onColor={active ? c.onSuccess : c.onSecondaryContainer}
      elevationLevel={active ? 2 : 1}
      gap={3}
    />
  );
}

// Horizontal theme accelerator and brake. Tonal at rest; held pedals fill with
// success (gas) or error (brake) and shrink slightly.
export function PedalButton({
  kind,
  active,
  ...press
}: PressProps & { kind: 'gas' | 'brake'; active: boolean }) {
  const c = useColors();
  const gas = kind === 'gas';
  const activeFill = gas ? c.success : c.error;
  const activeOn = gas ? c.onSuccess : c.onError;
  return (
    <CircleButton
      {...press}
      size={100}
      icon={gas ? 'arrow-up' : 'arrow-down'}
      iconSize={36}
      iconStrokeWidth={2.5}
      label={gas ? 'GAS' : 'BRAKE'}
      labelStyle="labelMedium"
      fill={active ? activeFill : c.secondaryContainer}
      onColor={active ? activeOn : c.onSecondaryContainer}
      elevationLevel={active ? 2 : 1}
      scale={active ? 0.95 : undefined}
      gap={3}
    />
  );
}

// Horn (press and hold) and light (tap to toggle), one style in both themes.
export function UtilityButton({
  kind,
  on = false,
  size,
  ...press
}: PressProps & {
  kind: 'horn' | 'light';
  // Light only: whether it is currently switched on.
  on?: boolean;
  size: 56 | 64;
}) {
  const c = useColors();
  const isHorn = kind === 'horn';
  let fill = c.secondaryContainer;
  let onColor = c.onSecondaryContainer;
  if (isHorn) {
    fill = c.warning;
    onColor = c.onWarning;
  } else if (on) {
    fill = c.success;
    onColor = c.onSuccess;
  }
  return (
    <CircleButton
      {...press}
      size={size}
      icon={isHorn ? 'horn' : 'bulb'}
      iconSize={size === 56 ? 22 : 24}
      label={isHorn ? 'HORN' : 'LIGHT'}
      labelStyle="labelSmall"
      fill={fill}
      onColor={onColor}
      elevationLevel={1}
      pressedLayer
      gap={2}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

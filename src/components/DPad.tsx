import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import ArrowIcon from '../icons/ArrowIcon';
import {
  elevation,
  fullRadius,
  stateLayer,
  typography,
  useColors,
  withAlpha,
  state,
} from '../theme';

type Props = {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onCenter?: () => void;
  onStop?: () => void;
};

const DPad = ({ onCenter, onUp, onDown, onLeft, onRight, onStop }: Props) => {
  const c = useColors();
  const handlePress = (direction: string) => {
    switch (direction) {
      case 'UP':
        onUp && onUp();
        break;
      case 'DOWN':
        onDown && onDown();
        break;
      case 'LEFT':
        onLeft && onLeft();
        break;
      case 'RIGHT':
        onRight && onRight();
        break;
      case 'OK':
        onCenter && onCenter();
        break;
      case 'STOP':
        onStop && onStop();
        break;
      default:
        break;
    }
    console.log(`${direction} pressed`);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.outerCircle,
          { backgroundColor: c.surfaceContainerHigh },
          elevation[2],
        ]}
      >
        {/* The 2x2 Grid rotated 45 degrees to create the "X" dividers */}
        <View style={styles.rotatedGrid}>
          {/* Top Quadrant (Top-Left in the grid) */}
          <Pressable
            style={({ pressed }) => [
              styles.quadrant,
              { borderColor: c.outlineVariant },
              pressed && {
                backgroundColor: withAlpha(c.onSurface, state.pressed),
              },
            ]}
            onPressIn={() => handlePress('UP')}
            onPressOut={() => handlePress('STOP')}
          >
            <View style={styles.iconUp}>
              <ArrowIcon direction="UP" color={c.onSurface} />
            </View>
          </Pressable>

          {/* Right Quadrant (Top-Right in the grid) */}
          <Pressable
            style={({ pressed }) => [
              styles.quadrant,
              { borderColor: c.outlineVariant },
              pressed && {
                backgroundColor: withAlpha(c.onSurface, state.pressed),
              },
            ]}
            onPressIn={() => handlePress('RIGHT')}
            onPressOut={() => handlePress('STOP')}
          >
            <View style={styles.iconRight}>
              <ArrowIcon direction="RIGHT" color={c.onSurface} />
            </View>
          </Pressable>

          {/* Left Quadrant (Bottom-Left in the grid) */}
          <Pressable
            style={({ pressed }) => [
              styles.quadrant,
              { borderColor: c.outlineVariant },
              pressed && {
                backgroundColor: withAlpha(c.onSurface, state.pressed),
              },
            ]}
            onPressIn={() => handlePress('LEFT')}
            onPressOut={() => handlePress('STOP')}
          >
            <View style={styles.iconLeft}>
              <ArrowIcon direction="LEFT" color={c.onSurface} />
            </View>
          </Pressable>

          {/* Bottom Quadrant (Bottom-Right in the grid) */}
          <Pressable
            style={({ pressed }) => [
              styles.quadrant,
              { borderColor: c.outlineVariant },
              pressed && {
                backgroundColor: withAlpha(c.onSurface, state.pressed),
              },
            ]}
            onPressIn={() => handlePress('DOWN')}
            onPressOut={() => handlePress('STOP')}
          >
            <View style={styles.iconDown}>
              <ArrowIcon direction="DOWN" color={c.onSurface} />
            </View>
          </Pressable>
        </View>

        {/* Center OK Button */}
        <Pressable
          style={({ pressed }) => [
            styles.okButton,
            {
              backgroundColor: pressed
                ? stateLayer(c.primary, c.onPrimary)
                : c.primary,
            },
            elevation[3],
          ]}
          onPressIn={() => handlePress('OK')}
          onPressOut={() => handlePress('STOP')}
        >
          <Text style={[typography.labelMedium, { color: c.onPrimary }]}>
            STOP
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
// Arrows sit on their axis, halfway between the STOP button (radius 70) and
// the rim (radius 150). Each icon is centered in its quadrant of the 45deg
// rotated grid, so it is shifted toward the center by this diagonal offset and
// counter-rotated to stay upright.
const GRID_SIZE = 450;
const ARROW_RADIUS = 110;
const ARROW_OFFSET = GRID_SIZE / 4 - ARROW_RADIUS * Math.SQRT1_2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 300,
    height: 300,
    borderRadius: fullRadius(300),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatedGrid: {
    width: 450, // Larger to ensure full coverage after rotation
    height: 450,
    flexDirection: 'row',
    flexWrap: 'wrap',
    transform: [{ rotate: '45deg' }],
  },
  quadrant: {
    width: '50%',
    height: '50%',
    borderWidth: 1, // This creates the diagonal lines
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconUp: {
    transform: [
      { translateX: ARROW_OFFSET },
      { translateY: ARROW_OFFSET },
      { rotate: '-45deg' },
    ],
  },
  iconRight: {
    transform: [
      { translateX: -ARROW_OFFSET },
      { translateY: ARROW_OFFSET },
      { rotate: '-45deg' },
    ],
  },
  iconDown: {
    transform: [
      { translateX: -ARROW_OFFSET },
      { translateY: -ARROW_OFFSET },
      { rotate: '-45deg' },
    ],
  },
  iconLeft: {
    transform: [
      { translateX: ARROW_OFFSET },
      { translateY: -ARROW_OFFSET },
      { rotate: '-45deg' },
    ],
  },
  okButton: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: fullRadius(140),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default DPad;

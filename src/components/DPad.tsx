import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ArrowIcon from '../icons/ArrowIcon';
type Props = {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onCenter?: () => void;
  onStop?: () => void;
};

const DPad = ({ onCenter, onUp, onDown, onLeft, onRight, onStop }: Props) => {
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
      <View style={styles.outerCircle}>
        {/* The 2x2 Grid rotated 45 degrees to create the "X" dividers */}
        <View style={styles.rotatedGrid}>
          {/* Top Quadrant (Top-Left in the grid) */}
          <TouchableOpacity
            style={styles.quadrant}
            onPressIn={() => handlePress('UP')}
            onPressOut={() => handlePress('STOP')}
          >
            <View style={styles.iconUp}>
              <ArrowIcon direction="UP" />
            </View>
          </TouchableOpacity>

          {/* Right Quadrant (Top-Right in the grid) */}
          <TouchableOpacity
            style={styles.quadrant}
            onPressIn={() => handlePress('RIGHT')}
            onPressOut={() => handlePress('STOP')}
          >
            <View style={styles.iconRight}>
              <ArrowIcon direction="RIGHT" />
            </View>
          </TouchableOpacity>

          {/* Left Quadrant (Bottom-Left in the grid) */}
          <TouchableOpacity
            style={styles.quadrant}
            onPressIn={() => handlePress('LEFT')}
            onPressOut={() => handlePress('STOP')}
          >
            <View style={styles.iconLeft}>
              <ArrowIcon direction="LEFT" />
            </View>
          </TouchableOpacity>

          {/* Bottom Quadrant (Bottom-Right in the grid) */}
          <TouchableOpacity
            style={styles.quadrant}
            onPressIn={() => handlePress('DOWN')}
            onPressOut={() => handlePress('STOP')}
          >
            <View style={styles.iconDown}>
              <ArrowIcon direction="DOWN" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Center OK Button */}
        <TouchableOpacity
          style={styles.okButton}
          onPressIn={() => handlePress('OK')}
          onPressOut={() => handlePress('STOP')}
          activeOpacity={0.8}
        >
          <Text style={styles.okText}>STOP</Text>
        </TouchableOpacity>
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
    borderRadius: 150,
    backgroundColor: '#435b66',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3e46',
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
    borderColor: '#34495e',
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
    borderRadius: 70,
    backgroundColor: '#8da3af',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#435b66', // Matches outer circle to hide center borders
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  okText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
export default DPad;

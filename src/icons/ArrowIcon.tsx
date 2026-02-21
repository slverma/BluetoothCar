import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type ArrowIconProps = {
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
};

// Custom SVG Icon Component
const ArrowIcon = ({ direction }: ArrowIconProps) => {
  const rotations = {
    UP: '0deg',
    RIGHT: '90deg',
    DOWN: '180deg',
    LEFT: '270deg',
  };

  return (
    <View style={{ transform: [{ rotate: rotations[direction] }] }}>
      <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <Path
          d="M18 15L12 9L6 15"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default ArrowIcon;

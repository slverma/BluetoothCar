import { Animated } from 'react-native';
import RefreshIconSvg from './refresh-icon.svg';

const RefreshIcon = ({
  color,
  spinAnim,
}: {
  color: string;
  spinAnim: Animated.Value;
}) => (
  <Animated.View
    style={[
      {
        transform: [
          {
            rotate: spinAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      },
    ]}
  >
    <RefreshIconSvg width={24} height={24} fill={color} />
  </Animated.View>
);
export default RefreshIcon;

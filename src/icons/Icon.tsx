import React from 'react';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

// Line icons on a 24x24 grid (Feather / Lucide style, matching SettingsIcon).
// They replace emoji, which render differently across Android devices.
const ICONS = {
  'arrow-up': (
    <>
      <Line x1="12" y1="19" x2="12" y2="5" />
      <Path d="M5 12l7-7 7 7" />
    </>
  ),
  'arrow-down': (
    <>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Path d="M19 12l-7 7-7-7" />
    </>
  ),
  'arrow-left': (
    <>
      <Line x1="19" y1="12" x2="5" y2="12" />
      <Path d="M12 19l-7-7 7-7" />
    </>
  ),
  'arrow-right': (
    <>
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Path d="M12 5l7 7-7 7" />
    </>
  ),
  stop: <Rect x="5" y="5" width="14" height="14" rx="2" />,
  check: <Path d="M20 6L9 17l-5-5" />,
  close: (
    <>
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  car: (
    <>
      <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <Circle cx="7" cy="17" r="2" />
      <Path d="M9 17h6" />
      <Circle cx="17" cy="17" r="2" />
    </>
  ),
  phone: (
    <>
      <Rect x="5" y="2" width="14" height="20" rx="2" />
      <Line x1="12" y1="18" x2="12.01" y2="18" />
    </>
  ),
  horn: (
    <>
      <Path d="M3 11l18-5v12L3 14v-3z" />
      <Path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>
  ),
  'horn-off': (
    <>
      <Path d="M3 11l18-5v12L3 14v-3z" />
      <Path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      <Line x1="2" y1="2" x2="22" y2="22" />
    </>
  ),
  bulb: (
    <>
      <Path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <Line x1="9" y1="18" x2="15" y2="18" />
      <Line x1="10" y1="22" x2="14" y2="22" />
    </>
  ),
  'bulb-off': (
    <>
      <Path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <Line x1="9" y1="18" x2="15" y2="18" />
      <Line x1="10" y1="22" x2="14" y2="22" />
      <Line x1="2" y1="2" x2="22" y2="22" />
    </>
  ),
  palette: (
    <>
      <Circle cx="13.5" cy="6.5" r=".5" />
      <Circle cx="17.5" cy="10.5" r=".5" />
      <Circle cx="8.5" cy="7.5" r=".5" />
      <Circle cx="6.5" cy="12.5" r=".5" />
      <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </>
  ),
  list: (
    <>
      <Line x1="8" y1="6" x2="21" y2="6" />
      <Line x1="8" y1="12" x2="21" y2="12" />
      <Line x1="8" y1="18" x2="21" y2="18" />
      <Line x1="3" y1="6" x2="3.01" y2="6" />
      <Line x1="3" y1="12" x2="3.01" y2="12" />
      <Line x1="3" y1="18" x2="3.01" y2="18" />
    </>
  ),
};

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export default function Icon({
  name,
  size = 24,
  color = '#000',
  strokeWidth = 2,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[name]}
      </G>
    </Svg>
  );
}

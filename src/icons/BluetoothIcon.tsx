import BluetoothIconSvg from './bluetooth-icon.svg';

const BluetoothIcon = ({ color, size }: { color: string; size: number }) => (
  <BluetoothIconSvg width={size} height={size} fill={color} />
);

export default BluetoothIcon;

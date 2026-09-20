import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useBluetooth } from '../contexts/BluetoothContext';
import BluetoothIcon from '../icons/BluetoothIcon';
import RefreshIcon from '../icons/RefreshIcon';
import { useColors } from '../theme';
import IconButton from './IconButton';
import PulseRing from './PulseRing';

type ConnectionButtonProps = {
  size?: number;
  onPress: () => void;
};

// Header button that opens the device list and reflects the link state:
// primary Bluetooth icon (pulsing) when idle, a rotating refresh icon while
// scanning, a spinner while a connection is being made, success once paired.
export default function ConnectionButton({
  size,
  onPress,
}: ConnectionButtonProps) {
  const c = useColors();
  const { connectedDevice, isScanning, isConnecting, spinAnim } =
    useBluetooth();

  return (
    <IconButton
      variant="filled"
      tone={connectedDevice ? 'success' : 'primary'}
      size={size}
      onPress={onPress}
      accessibilityLabel={isConnecting ? 'Connecting to device' : 'Devices'}
    >
      {color => (
        <>
          <PulseRing
            active={!connectedDevice && !isScanning && !isConnecting}
            color={c.primary}
          />
          {isConnecting ? (
            <ActivityIndicator size={24} color={color} />
          ) : isScanning ? (
            <RefreshIcon color={color} spinAnim={spinAnim} />
          ) : (
            <BluetoothIcon color={color} size={24} />
          )}
        </>
      )}
    </IconButton>
  );
}

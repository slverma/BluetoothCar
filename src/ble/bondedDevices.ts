import { NativeModules, Platform } from 'react-native';

export interface BondedDevice {
  id: string;
  name: string | null;
  address: string;
}

export const getBondedDevices = async (): Promise<BondedDevice[]> => {
  if (Platform.OS !== 'android') {
    console.log('Bonded devices only supported on Android');
    return [];
  }

  try {
    // For now, return empty array - will need native implementation
    // In a real implementation, you'd use a native module to access
    // BluetoothAdapter.getBondedDevices() on Android
    console.log('Getting bonded devices...');
    return [];
  } catch (error) {
    console.error('Error getting bonded devices:', error);
    return [];
  }
};

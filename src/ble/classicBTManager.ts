import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

class ClassicBluetoothManager {
  async isEnabled(): Promise<boolean> {
    try {
      return await RNBluetoothClassic.isBluetoothEnabled();
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
      return false;
    }
  }

  async getBondedDevices(): Promise<BluetoothDevice[]> {
    try {
      const bonded = await RNBluetoothClassic.getBondedDevices();
      console.log('Bonded devices:', bonded);
      return bonded;
    } catch (error) {
      console.error('Error getting bonded devices:', error);
      return [];
    }
  }

  async startDiscovery(): Promise<BluetoothDevice[]> {
    try {
      const devices = await RNBluetoothClassic.startDiscovery();
      console.log('Discovered devices:', devices);
      return devices;
    } catch (error) {
      console.error('Error during discovery:', error);
      return [];
    }
  }

  async cancelDiscovery(): Promise<boolean> {
    try {
      return await RNBluetoothClassic.cancelDiscovery();
    } catch (error) {
      console.error('Error canceling discovery:', error);
      return false;
    }
  }

  async connect(deviceId: string): Promise<BluetoothDevice> {
    try {
      const device = await RNBluetoothClassic.connectToDevice(deviceId);
      console.log('Connected to Classic device:', device);
      return device;
    } catch (error) {
      console.error('Error connecting to Classic device:', error);
      throw error;
    }
  }

  async disconnect(deviceId: string): Promise<boolean> {
    try {
      const success = await RNBluetoothClassic.disconnectFromDevice(deviceId);
      console.log('Disconnected from Classic device');
      return success;
    } catch (error) {
      console.error('Error disconnecting from Classic device:', error);
      return false;
    }
  }

  async write(deviceId: string, data: string): Promise<boolean> {
    try {
      const success = await RNBluetoothClassic.writeToDevice(deviceId, data);
      return success;
    } catch (error) {
      console.error('Error writing to Classic device:', error);
      return false;
    }
  }
}

export const classicBTManager = new ClassicBluetoothManager();

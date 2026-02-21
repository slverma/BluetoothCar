import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { Device } from 'react-native-ble-plx';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { bleManager } from '../ble/bleManager';
import { classicBTManager } from '../ble/classicBTManager';
import { requestBlePermissions } from '../ble/permissions';
import { Animated } from 'react-native';

export type UnifiedDevice = {
  id: string;
  name: string | null;
  localName?: string | null;
  deviceType?: 'BLE' | 'CLASSIC';
  address?: string;
  _bleDevice?: Device;
  _classicDevice?: BluetoothDevice;
};

interface BluetoothContextType {
  devices: UnifiedDevice[];
  connectedDevice: UnifiedDevice | null;
  isScanning: boolean;
  isConnecting: boolean;
  spinAnim: Animated.Value;
  startScan: () => Promise<void>;
  stopScan: () => void;
  connectToDevice: (device: UnifiedDevice) => Promise<void>;
  disconnectDevice: () => Promise<void>;
  clearDevices: () => void;
  sendData: (data: string) => Promise<boolean>;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(
  undefined,
);

export const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<UnifiedDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<UnifiedDevice | null>(
    null,
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [spinAnim] = useState(new Animated.Value(0));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('BluetoothProvider unmounting, cleaning up...');
      try {
        bleManager.stopDeviceScan();
        classicBTManager.cancelDiscovery();
      } catch (error) {
        console.log('Cleanup error:', error);
      }
    };
  }, []);

  const stopScan = useCallback(() => {
    console.log('Stopping scan...');
    bleManager.stopDeviceScan();
    classicBTManager.cancelDiscovery();
    setIsScanning(false);
    spinAnim.setValue(0);
  }, [spinAnim]);

  const startScan = useCallback(async () => {
    const granted = await requestBlePermissions();
    console.log('Permissions granted:', granted);
    if (!granted) return;

    setIsScanning(true);

    // Start spin animation
    spinAnim.setValue(0);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();

    console.log('Getting bonded Classic Bluetooth devices...');

    // Get Classic Bluetooth bonded devices (includes HC-05)
    try {
      const bondedDevices = await classicBTManager.getBondedDevices();
      console.log('Bonded Classic devices found:', bondedDevices.length);

      bondedDevices.forEach(device => {
        console.log('Bonded Classic device:', device.name, device.address);
        const unifiedDevice: UnifiedDevice = {
          id: device.address,
          name: device.name,
          address: device.address,
          deviceType: 'CLASSIC',
          _classicDevice: device,
        };
        setDevices(prev =>
          prev.find(d => d.id === unifiedDevice.id)
            ? prev
            : [...prev, unifiedDevice],
        );
      });
    } catch (error: any) {
      console.log('Error getting bonded devices:', error?.message || error);
    }

    // Get BLE connected devices
    console.log('Getting connected BLE devices...');
    try {
      const connectedDevices = await bleManager.connectedDevices([]);
      console.log('Connected BLE devices found:', connectedDevices.length);

      connectedDevices.forEach(device => {
        console.log(
          'Connected BLE device:',
          device.name || device.localName || 'Unnamed',
          device.id,
        );
        const unifiedDevice: UnifiedDevice = {
          id: device.id,
          name: device.name || device.localName,
          deviceType: 'BLE',
          _bleDevice: device,
        };
        setDevices(prev =>
          prev.find(d => d.id === unifiedDevice.id)
            ? prev
            : [...prev, unifiedDevice],
        );
      });
    } catch (error: any) {
      console.log('Error getting connected devices:', error?.message || error);
    }

    // Start BLE scan for nearby devices
    console.log('Starting BLE scan...');
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error?.message || error);
        // Stop scanning on error
        setIsScanning(false);
        spinAnim.setValue(0);
        return;
      }

      if (device && (device.name || device.localName)) {
        const unifiedDevice: UnifiedDevice = {
          id: device.id,
          name: device.name || device.localName,
          deviceType: 'BLE',
          _bleDevice: device,
        };
        setDevices(prev =>
          prev.find(d => d.id === unifiedDevice.id)
            ? prev
            : [...prev, unifiedDevice],
        );
      }
    });

    // Auto-stop scan after 10 seconds
    setTimeout(() => {
      stopScan();
    }, 10000);
  }, [spinAnim, stopScan]);

  const connectToDevice = useCallback(
    async (device: UnifiedDevice) => {
      try {
        setIsConnecting(true);
        console.log(
          'Connecting to device:',
          device.name,
          'Type:',
          device.deviceType,
        );

        // Stop scanning before connecting
        if (isScanning) {
          stopScan();
        }

        if (device.deviceType === 'CLASSIC') {
          // Connect to Classic Bluetooth device
          const connected = await classicBTManager.connect(device.id);
          setConnectedDevice({
            id: connected.address,
            name: connected.name,
            address: connected.address,
            deviceType: 'CLASSIC',
            _classicDevice: connected,
          });
          console.log(
            'Successfully connected to Classic device:',
            connected.name,
          );
        } else if (device._bleDevice) {
          // Connect to BLE device with proper error handling
          try {
            // First check if device is already connected
            const isConnected = await device._bleDevice.isConnected();
            if (isConnected) {
              console.log(
                'Device already connected, using existing connection',
              );
              setConnectedDevice({
                id: device.id,
                name: device.name,
                deviceType: 'BLE',
                _bleDevice: device._bleDevice,
              });
              return;
            }

            const connected = await bleManager
              .connectToDevice(device.id, {
                timeout: 10000,
                autoConnect: false,
              })
              .catch((err: any) => {
                // Catch connection errors immediately to prevent null propagation
                const errorMsg =
                  err?.message || err?.reason || 'Connection failed';
                console.error('Direct connection error:', errorMsg);
                throw new Error(errorMsg);
              });

            // Ensure device is connected before discovering services
            if (connected) {
              await connected
                .discoverAllServicesAndCharacteristics()
                .catch((err: any) => {
                  const errorMsg = err?.message || 'Service discovery failed';
                  console.error('Service discovery error:', errorMsg);
                  throw new Error(errorMsg);
                });

              setConnectedDevice({
                id: connected.id,
                name: connected.name || connected.localName,
                deviceType: 'BLE',
                _bleDevice: connected,
              });
              console.log(
                'Successfully connected to BLE device:',
                connected.name,
              );

              // Setup disconnect listener for BLE
              connected.onDisconnected((error, disconnectedDevice) => {
                console.log(
                  'BLE device disconnected:',
                  disconnectedDevice?.name || 'Unknown',
                  error?.message || 'No error message',
                );
                setConnectedDevice(null);
              });
            }
          } catch (bleError: any) {
            const errorMessage =
              bleError?.message ||
              bleError?.reason ||
              String(bleError) ||
              'Failed to connect to BLE device';
            console.error('BLE connection error:', errorMessage);

            // Clean up any partial connection
            try {
              await bleManager.cancelDeviceConnection(device.id).catch(() => {
                // Silently ignore cleanup errors
              });
            } catch (cleanupError) {
              console.info('Cleanup error (can be ignored):', cleanupError);
              // Silently ignore cleanup errors
            }
            throw new Error(errorMessage);
          }
        }
      } catch (error: any) {
        console.error('Connection error:', error?.message || error);
        setConnectedDevice(null);
        throw error;
      } finally {
        setIsConnecting(false);
      }
    },
    [isScanning, stopScan],
  );

  const disconnectDevice = useCallback(async () => {
    if (connectedDevice) {
      try {
        console.log('Disconnecting from:', connectedDevice.name);

        if (connectedDevice.deviceType === 'CLASSIC') {
          await classicBTManager.disconnect(connectedDevice.id);
        } else if (connectedDevice._bleDevice) {
          // Check if device is still connected before disconnecting
          try {
            const isConnected = await connectedDevice._bleDevice
              .isConnected()
              .catch(() => false);
            if (isConnected) {
              await bleManager
                .cancelDeviceConnection(connectedDevice.id)
                .catch((err: any) => {
                  const errorMsg = err?.message || 'Disconnect failed';
                  console.log('Disconnect error:', errorMsg);
                });
            } else {
              console.log('Device already disconnected');
            }
          } catch (disconnectError: any) {
            console.log(
              'Disconnect error (can be ignored):',
              disconnectError?.message || String(disconnectError),
            );
          }
        }

        setConnectedDevice(null);
        console.log('Disconnected successfully');
      } catch (error: any) {
        console.error('Disconnect error:', error?.message || String(error));
        // Still clear the connected device even if disconnect fails
        setConnectedDevice(null);
      }
    }
  }, [connectedDevice]);

  const clearDevices = useCallback(() => {
    setDevices([]);
  }, []);

  const sendData = useCallback(
    async (data: string): Promise<boolean> => {
      if (!connectedDevice) {
        console.error('No device connected');
        return false;
      }

      try {
        console.log('Sending data:', data, 'to', connectedDevice.name);

        if (connectedDevice.deviceType === 'CLASSIC') {
          // Send data to Classic Bluetooth device
          const success = await classicBTManager.write(
            connectedDevice.id,
            data,
          );
          console.log('Classic BT write success:', success);
          return success;
        } else if (connectedDevice._bleDevice) {
          // For BLE, you would need to write to a specific characteristic
          // This is a placeholder - you'll need to implement based on your BLE device
          console.log('BLE write not implemented yet');
          return false;
        }

        return false;
      } catch (error: any) {
        console.error('Error sending data:', error?.message || error);
        return false;
      }
    },
    [connectedDevice],
  );

  const value: BluetoothContextType = {
    devices,
    connectedDevice,
    isScanning,
    isConnecting,
    spinAnim,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
    clearDevices,
    sendData,
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (context === undefined) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

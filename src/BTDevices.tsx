import { useEffect } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useBluetooth } from './contexts/BluetoothContext';
import RefreshIcon from './icons/RefreshIcon';

type BTDevicesProps = {
  showModal: boolean;
  setShowModal: (visible: boolean) => void;
};

const BTDevices = ({ showModal, setShowModal }: BTDevicesProps) => {
  const {
    devices,
    connectedDevice,
    isScanning,
    isConnecting,
    spinAnim,
    startScan,
    connectToDevice,
    disconnectDevice,
  } = useBluetooth();

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    if (showModal) {
      startScan();
    }
  }, [showModal, startScan]);

  const handleDevicePress = async (device: any) => {
    try {
      if (connectedDevice?.id === device.id) {
        // Disconnect if already connected
        await disconnectDevice();
        Alert.alert('Disconnected', `Disconnected from ${device.name}`);
      } else {
        // Connect to new device
        await connectToDevice(device);
        Alert.alert('Connected', `Connected to ${device.name}`);
        setShowModal(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to device');
      console.error('Connection error:', error);
    }
  };

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              Available Devices
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.rescanIconButton}
                onPress={() => {
                  startScan();
                }}
                disabled={isScanning}
              >
                <RefreshIcon color={textColor} spinAnim={spinAnim} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={[styles.closeButton, { color: textColor }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {devices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: textColor }]}>
                {isScanning ? 'Scanning for devices...' : 'No devices found'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={devices}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isConnected = connectedDevice?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.deviceItem,
                      { borderBottomColor: isDarkMode ? '#333' : '#ddd' },
                      isConnected && styles.deviceItemConnected,
                    ]}
                    onPress={() => handleDevicePress(item)}
                    disabled={isConnecting}
                  >
                    <View style={styles.deviceInfo}>
                      <Text style={[styles.deviceName, { color: textColor }]}>
                        {item.name || item.localName || 'Unnamed Device'}
                        {isConnected && ' ✓'}
                      </Text>
                      <View style={styles.deviceIdRow}>
                        <Text style={styles.deviceId}>{item.id}</Text>
                        {item.deviceType && (
                          <View
                            style={[
                              styles.deviceTypeBadge,
                              item.deviceType === 'CLASSIC'
                                ? styles.classicBadge
                                : styles.bleBadge,
                            ]}
                          >
                            <Text style={styles.deviceTypeText}>
                              {item.deviceType}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    {isConnected && (
                      <View style={styles.connectedBadge}>
                        <Text style={styles.connectedText}>Connected</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
export default BTDevices;

const styles = StyleSheet.create({
  connectionButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  connectionIcon: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  rescanIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  deviceItemConnected: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  deviceTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  classicBadge: {
    backgroundColor: '#FF9500',
  },
  bleBadge: {
    backgroundColor: '#007AFF',
  },
  deviceTypeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  connectedBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeModalButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    fontWeight: '600',
  },
  spacer: {
    width: 40,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
  device: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

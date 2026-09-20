import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBluetooth } from './contexts/BluetoothContext';
import Badge from './components/Badge';
import { OutlinedButton } from './components/Button';
import IconButton from './components/IconButton';
import RefreshIcon from './icons/RefreshIcon';
import Icon from './icons/Icon';
import {
  elevation,
  shape,
  space,
  stateLayer,
  typography,
  useColors,
} from './theme';

type BTDevicesProps = {
  showModal: boolean;
  setShowModal: (visible: boolean) => void;
};

const Divider = () => {
  const c = useColors();
  return (
    <View style={[styles.divider, { backgroundColor: c.outlineVariant }]} />
  );
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

  const c = useColors();
  const safeAreaInsets = useSafeAreaInsets();
  // Which row the user tapped, so only that one shows the loader.
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    if (showModal) {
      startScan();
    }
  }, [showModal, startScan]);

  const handleDevicePress = async (device: any) => {
    setConnectingId(device.id);
    try {
      await connectToDevice(device);
      Alert.alert('Connected', `Connected to ${device.name}`);
      setShowModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to device');
      console.error('Connection error:', error);
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnectPress = async () => {
    try {
      await disconnectDevice();
    } catch (error) {
      Alert.alert('Error', 'Failed to disconnect from device');
      console.error('Disconnect error:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: c.scrim }]}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: c.surfaceContainerHighest,
              paddingBottom: space[5] + safeAreaInsets.bottom,
            },
            elevation[3],
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[typography.titleLarge, { color: c.onSurface }]}>
              Available Devices
            </Text>
            <View style={styles.headerActions}>
              <IconButton
                variant="tonal"
                onPress={() => {
                  startScan();
                }}
                disabled={isScanning || isConnecting}
                accessibilityLabel="Scan for devices"
              >
                {color => <RefreshIcon color={color} spinAnim={spinAnim} />}
              </IconButton>
              <IconButton
                variant="ghost"
                onPress={() => setShowModal(false)}
                accessibilityLabel="Close device list"
              >
                {color => <Icon name="close" size={24} color={color} />}
              </IconButton>
            </View>
          </View>

          {devices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text
                style={[typography.bodyLarge, { color: c.onSurfaceVariant }]}
              >
                {isScanning ? 'Scanning for devices...' : 'No devices found'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={devices}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={Divider}
              renderItem={({ item }) => {
                const isConnected = connectedDevice?.id === item.id;
                const isConnectingThis =
                  isConnecting && connectingId === item.id;
                let fill = c.surfaceContainerHigh;
                let onFill = c.onSurface;
                if (isConnected) {
                  fill = c.successContainer;
                  onFill = c.onSuccessContainer;
                } else if (isConnectingThis) {
                  fill = c.primaryContainer;
                  onFill = c.onPrimaryContainer;
                }
                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.deviceItem,
                      {
                        backgroundColor:
                          pressed && !isConnected
                            ? stateLayer(fill, onFill)
                            : fill,
                      },
                    ]}
                    onPress={() => handleDevicePress(item)}
                    disabled={isConnecting || isConnected}
                    accessibilityState={{ busy: isConnectingThis }}
                  >
                    <View style={styles.deviceInfo}>
                      <View style={styles.deviceNameRow}>
                        <Text
                          style={[typography.titleMedium, { color: onFill }]}
                        >
                          {item.name || item.localName || 'Unnamed Device'}
                        </Text>
                        {isConnected && (
                          <Icon name="check" size={16} color={onFill} />
                        )}
                      </View>
                      <View style={styles.deviceMetaRow}>
                        <Text
                          style={[
                            typography.labelMedium,
                            styles.deviceId,
                            { color: c.onSurfaceVariant },
                          ]}
                          numberOfLines={1}
                        >
                          {item.id}
                        </Text>
                        {item.deviceType && <Badge kind={item.deviceType} />}
                      </View>
                    </View>
                    {isConnectingThis && (
                      <View style={styles.connectingStatus}>
                        <ActivityIndicator size={20} color={onFill} />
                        <Text
                          style={[typography.labelLarge, { color: onFill }]}
                        >
                          Connecting...
                        </Text>
                      </View>
                    )}
                    {isConnected && (
                      <OutlinedButton
                        label="Disconnect"
                        onPress={handleDisconnectPress}
                        accessibilityLabel={`Disconnect from ${
                          item.name || item.localName || 'device'
                        }`}
                      />
                    )}
                  </Pressable>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: shape.xl,
    borderTopRightRadius: shape.xl,
    paddingTop: space[5],
    paddingHorizontal: space[5],
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[5],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[4],
    paddingHorizontal: space[3],
    borderRadius: shape.md,
  },
  connectingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space[1],
  },
  deviceInfo: {
    flex: 1,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    marginBottom: space[1],
  },
  deviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deviceId: {
    flex: 1,
  },
  emptyState: {
    paddingVertical: space[8],
    alignItems: 'center',
  },
});

import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BTDevices from './BTDevices';
import BluetoothIcon from './icons/BluetoothIcon';
import RefreshIcon from './icons/RefreshIcon';
import SettingsIcon from './icons/SettingsIcon';
import { useBluetooth } from './contexts/BluetoothContext';
import { useSettings } from './contexts/SettingsContext';
import DPad from './components/DPad';
import SettingsModal from './components/SettingsModal';
import HorizontalTheme from './components/HorizontalTheme';

export default function BTPanel() {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const { connectedDevice, spinAnim, sendData } = useBluetooth();
  const { commands, theme } = useSettings();

  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);

  console.log('BTPanel rendering with theme:', theme);
  console.log('Theme type:', typeof theme);
  console.log('Is horizontal?', theme === 'horizontal');
  console.log('Is vertical?', theme === 'vertical');

  console.log('Rendering VERTICAL layout');

  const handleStop = async () => {
    console.log('Stop');
    if (connectedDevice) {
      await sendData(commands.stop);
    }
  };

  const handleForwardPress = async () => {
    console.log('Forward');
    if (connectedDevice) {
      await sendData(commands.forward);
    }
  };

  const handleBackwardPress = async () => {
    console.log('Backward');
    if (connectedDevice) {
      await sendData(commands.backward);
    }
  };

  const handleLeftPress = async () => {
    console.log('Left');
    if (connectedDevice) {
      await sendData(commands.left);
    }
  };

  const handleRightPress = async () => {
    console.log('Right');
    if (connectedDevice) {
      await sendData(commands.right);
    }
  };

  const hornOn = async () => {
    console.log('Horn on');
    if (connectedDevice) {
      await sendData(commands.hornOn);
    }
  };
  const hornOff = async () => {
    console.log('Horn off');
    if (connectedDevice) {
      await sendData(commands.hornOff);
    }
  };

  const handleLightToggle = async () => {
    const newLightState = !isLightOn;
    console.log(`Toggling light: ${newLightState ? 'ON' : 'OFF'}`);
    if (connectedDevice) {
      await sendData(newLightState ? commands.lightOn : commands.lightOff);
      setIsLightOn(newLightState);
    }
  };

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';

  // If horizontal theme is selected, render the horizontal layout
  if (theme === 'horizontal') {
    console.log('Rendering HORIZONTAL layout');
    return (
      <View style={styles.horizontalContainer}>
        <BTDevices showModal={showModal} setShowModal={setShowModal} />
        <SettingsModal
          visible={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
        <View style={styles.horizontalHeader}>
          <TouchableOpacity
            style={styles.settingsButtonHorizontal}
            onPress={() => setShowSettingsModal(true)}
          >
            <SettingsIcon color={isDarkMode ? '#fff' : '#000'} size={24} />
          </TouchableOpacity>

          <View style={styles.titleContainerHorizontal}>
            {connectedDevice ? (
              <Text
                style={[
                  styles.connectedDeviceTextHorizontal,
                  { color: isDarkMode ? '#fff' : '#000' },
                ]}
              >
                🚙 Connected: {connectedDevice.name}
              </Text>
            ) : (
              <Text
                style={[
                  styles.connectedDeviceTextHorizontal,
                  { color: isDarkMode ? '#fff' : '#000' },
                ]}
              >
                🚙 Not Connected
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.connectionButtonHorizontal,
              connectedDevice && styles.connectionButtonConnected,
            ]}
            onPress={() => setShowModal(true)}
          >
            <View style={styles.iconContainer}>
              <View style={styles.refreshIconBorder}>
                <RefreshIcon color="#fff" spinAnim={spinAnim} />
              </View>
              <View style={styles.bluetoothIconCenter}>
                <BluetoothIcon color="#fff" size={20} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <HorizontalTheme />
      </View>
    );
  }

  console.log('Rendering Vertical layout');
  return (
    <View
      style={[
        styles.container,
        { backgroundColor, paddingTop: safeAreaInsets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettingsModal(true)}
        >
          <SettingsIcon color={textColor} size={28} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>🚙</Text>
          <Text style={[styles.title, { color: textColor }]}>
            Bluetooth Car Controller
          </Text>
          {connectedDevice && (
            <Text style={[styles.connectedDeviceText]}>
              Connected to: {connectedDevice.name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.connectionButton,
            connectedDevice && styles.connectionButtonConnected,
          ]}
          onPress={() => {
            setShowModal(true);
          }}
        >
          <View style={styles.iconContainer}>
            <View style={styles.refreshIconBorder}>
              <RefreshIcon color="#fff" spinAnim={spinAnim} />
            </View>
            <View style={styles.bluetoothIconCenter}>
              <BluetoothIcon color="#fff" size={20} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <BTDevices showModal={showModal} setShowModal={setShowModal} />
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      <View style={styles.controlsContainer}>
        <View style={styles.extraControlsContainer}>
          <TouchableOpacity
            style={[styles.extraButton, styles.hornButton]}
            onPressIn={hornOn}
            onPressOut={hornOff}
            disabled={!connectedDevice}
          >
            <Text style={styles.extraButtonText}>📯</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.extraButton,
              isLightOn ? styles.lightButtonOn : styles.lightButton,
            ]}
            onPress={handleLightToggle}
            disabled={!connectedDevice}
          >
            <Text style={styles.extraButtonText}>💡</Text>
          </TouchableOpacity>
        </View>
        <DPad
          onUp={handleForwardPress}
          onDown={handleBackwardPress}
          onLeft={handleLeftPress}
          onRight={handleRightPress}
          onStop={handleStop}
          onCenter={handleStop}
        />
      </View>
      <View style={[styles.footer, { paddingBottom: safeAreaInsets.bottom }]}>
        <Text style={[styles.footerText, { color: textColor }]}>
          {connectedDevice
            ? 'Connected - Ready to control'
            : 'Connect to bluetooth to control'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingLeft: 70,
    paddingRight: 90,
    alignItems: 'center',
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  connectedDeviceText: {
    fontSize: 14,
    marginTop: 8,
    color: '#34C759',
    fontWeight: '600',
  },
  connectionButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
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
  connectionButtonConnected: {
    backgroundColor: '#34C759',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  refreshIconBorder: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bluetoothIconCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deviceItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
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
  extraControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 80,
    marginTop: 30,
  },
  extraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  hornButton: {
    backgroundColor: '#FF9500',
  },
  lightButton: {
    backgroundColor: '#FFD60A',
  },
  lightButtonOn: {
    backgroundColor: '#34C759',
  },
  extraButtonText: {
    fontSize: 40,
  },
  extraButtonLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },
  dpadWrapper: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  topPetal: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -50,
    width: 100,
    height: 100,
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  rightPetal: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -50,
    width: 100,
    height: 100,
    backgroundColor: '#E8E8E8',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomPetal: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -50,
    width: 100,
    height: 100,
    backgroundColor: '#E8E8E8',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  leftPetal: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -50,
    width: 100,
    height: 100,
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  centerStopWrapper: {
    position: 'absolute',
    width: 90,
    height: 90,
    top: '50%',
    left: '50%',
    marginTop: -45,
    marginLeft: -45,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerStop: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionText: {
    fontSize: 36,
    color: '#666',
    fontWeight: 'bold',
  },
  centerStopText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  dpadContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  bottomButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 80,
    height: 80,
    borderRadius: 40,
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
  stopButton: {
    backgroundColor: '#FF3B30',
    width: 80,
    height: 80,
    borderRadius: 40,
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
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  stopButtonText: {
    fontSize: 14,
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
    opacity: 0.7,
  },
  device: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  horizontalContainer: {
    flex: 1,
  },
  horizontalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    height: 60,
  },
  settingsButtonHorizontal: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainerHorizontal: {
    flex: 1,
    alignItems: 'center',
  },
  connectedDeviceTextHorizontal: {
    fontSize: 14,
    fontWeight: '600',
  },
  connectionButtonHorizontal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

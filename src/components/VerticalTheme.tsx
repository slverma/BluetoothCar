import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBluetooth } from '../contexts/BluetoothContext';
import { useSettings } from '../contexts/SettingsContext';
import { showNotConnectedToast } from '../utils/toast';
import BluetoothIcon from '../icons/BluetoothIcon';
import Icon from '../icons/Icon';
import RefreshIcon from '../icons/RefreshIcon';
import SettingsIcon from '../icons/SettingsIcon';
import DPad from './DPad';
import PulseRing from './PulseRing';

type VerticalThemeProps = {
  onOpenSettings: () => void;
  onOpenDevices: () => void;
};

const VerticalTheme = ({
  onOpenSettings,
  onOpenDevices,
}: VerticalThemeProps) => {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const { connectedDevice, isScanning, spinAnim, sendData } = useBluetooth();
  const { commands } = useSettings();

  const [isLightOn, setIsLightOn] = useState(false);

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
    } else {
      showNotConnectedToast();
    }
  };

  const handleBackwardPress = async () => {
    console.log('Backward');
    if (connectedDevice) {
      await sendData(commands.backward);
    } else {
      showNotConnectedToast();
    }
  };

  const handleLeftPress = async () => {
    console.log('Left');
    if (connectedDevice) {
      await sendData(commands.left);
    } else {
      showNotConnectedToast();
    }
  };

  const handleRightPress = async () => {
    console.log('Right');
    if (connectedDevice) {
      await sendData(commands.right);
    } else {
      showNotConnectedToast();
    }
  };

  const hornOn = async () => {
    console.log('Horn on');
    if (connectedDevice) {
      await sendData(commands.hornOn);
    } else {
      showNotConnectedToast();
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
    } else {
      showNotConnectedToast();
    }
  };

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const connectedColor = isDarkMode ? '#30D158' : '#248A3D';
  const accentColor = isDarkMode ? '#0A84FF' : '#007AFF';
  const pillColor = isDarkMode ? '#2C2C2E' : '#F2F2F7';
  const dimColor = isDarkMode
    ? 'rgba(0, 0, 0, 0.6)'
    : 'rgba(255, 255, 255, 0.6)';

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
          onPress={onOpenSettings}
        >
          <SettingsIcon color={textColor} size={28} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Icon name="car" size={32} color={textColor} />
          <Text style={[styles.title, { color: textColor }]}>
            Bluetooth Car Controller
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.connectionButton,
            connectedDevice && styles.connectionButtonConnected,
          ]}
          onPress={onOpenDevices}
        >
          <PulseRing active={!connectedDevice && !isScanning} />
          {isScanning ? (
            <RefreshIcon color="#fff" spinAnim={spinAnim} />
          ) : (
            <BluetoothIcon color="#fff" size={24} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.extraControlsContainer}>
          <TouchableOpacity
            style={[styles.extraButton, styles.hornButton]}
            onPressIn={hornOn}
            onPressOut={hornOff}
          >
            <Icon name="horn" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.extraButton,
              isLightOn ? styles.lightButtonOn : styles.lightButton,
            ]}
            onPress={handleLightToggle}
          >
            <Icon name="bulb" size={40} color={isLightOn ? '#000' : '#fff'} />
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
        {!connectedDevice && (
          <View
            pointerEvents="none"
            style={[styles.disabledOverlay, { backgroundColor: dimColor }]}
          />
        )}
      </View>
      <View
        style={[styles.footer, { paddingBottom: safeAreaInsets.bottom + 20 }]}
      >
        <View style={styles.footerContent}>
          {connectedDevice ? (
            <Text style={[styles.footerText, { color: connectedColor }]}>
              Connected - Ready to control
            </Text>
          ) : (
            <TouchableOpacity
              style={[styles.connectPill, { backgroundColor: pillColor }]}
              onPress={onOpenDevices}
              accessibilityRole="button"
              accessibilityLabel="Connect a device"
            >
              <BluetoothIcon color={accentColor} size={16} />
              <Text style={[styles.connectPillText, { color: textColor }]}>
                Connect a device
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

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
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // Dim with a translucent overlay: opacity on the container makes Android
  // draw it offscreen, which distorts rounded/clipped views like the D-pad.
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
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
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  // Both states fit in this height, so the layout doesn't shift on connect.
  footerContent: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectPill: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VerticalTheme;

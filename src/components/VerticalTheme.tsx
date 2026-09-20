import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBluetooth } from '../contexts/BluetoothContext';
import { useSettings } from '../contexts/SettingsContext';
import { showNotConnectedToast } from '../utils/toast';
import BluetoothIcon from '../icons/BluetoothIcon';
import Icon from '../icons/Icon';
import SettingsIcon from '../icons/SettingsIcon';
import { space, typography, useColors } from '../theme';
import ConnectionButton from './ConnectionButton';
import DPad from './DPad';
import IconButton from './IconButton';
import Pill from './Pill';
import { UtilityButton } from './ControlButtons';

type VerticalThemeProps = {
  onOpenSettings: () => void;
  onOpenDevices: () => void;
};

const VerticalTheme = ({
  onOpenSettings,
  onOpenDevices,
}: VerticalThemeProps) => {
  const safeAreaInsets = useSafeAreaInsets();
  const c = useColors();
  const { connectedDevice, sendData } = useBluetooth();
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

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: c.surfaceContainerLow,
            paddingTop: safeAreaInsets.top + space[5],
          },
        ]}
      >
        <View
          style={[
            styles.settingsButton,
            { top: safeAreaInsets.top + space[5] },
          ]}
        >
          <IconButton
            variant="ghost"
            onPress={onOpenSettings}
            accessibilityLabel="Settings"
          >
            {color => <SettingsIcon color={color} size={28} />}
          </IconButton>
        </View>
        <View style={styles.titleContainer}>
          <Icon name="car" size={32} color={c.onSurface} />
          <Text
            style={[
              typography.headlineSmall,
              styles.title,
              { color: c.onSurface },
            ]}
          >
            Bluetooth Car Controller
          </Text>
        </View>
        <View
          style={[
            styles.connectionButton,
            { top: safeAreaInsets.top + space[5] },
          ]}
        >
          <ConnectionButton onPress={onOpenDevices} />
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.extraControlsContainer}>
          <UtilityButton
            kind="horn"
            size={56}
            onPressIn={hornOn}
            onPressOut={hornOff}
          />
          <UtilityButton
            kind="light"
            size={56}
            on={isLightOn}
            onPress={handleLightToggle}
          />
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
            style={[
              styles.disabledOverlay,
              { backgroundColor: c.disabledScrim },
            ]}
          />
        )}
      </View>
      <View
        style={[
          styles.footer,
          {
            backgroundColor: c.surfaceContainerLow,
            paddingBottom: safeAreaInsets.bottom + space[5],
          },
        ]}
      >
        <View style={styles.footerContent}>
          {connectedDevice ? (
            <Text
              style={[
                typography.labelLarge,
                styles.footerText,
                { color: c.success },
              ]}
            >
              Connected – Ready to control
            </Text>
          ) : (
            <Pill
              label="Connect a device"
              onPress={onOpenDevices}
              renderIcon={color => <BluetoothIcon color={color} size={16} />}
            />
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
    padding: space[5],
    paddingLeft: 70,
    paddingRight: 90,
    alignItems: 'center',
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    left: space[5],
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  title: {
    textAlign: 'center',
  },
  connectionButton: {
    position: 'absolute',
    right: space[5],
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space[5],
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
    gap: space[9],
    marginTop: 30,
    marginBottom: space[7],
  },
  footer: {
    padding: space[5],
    alignItems: 'center',
  },
  // Both states fit in this height, so the layout doesn't shift on connect.
  footerContent: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
  },
});

export default VerticalTheme;

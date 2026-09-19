import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
} from 'react-native';
import { useBluetooth } from '../contexts/BluetoothContext';
import { useSettings } from '../contexts/SettingsContext';
import { showNotConnectedToast } from '../utils/toast';
import BluetoothIcon from '../icons/BluetoothIcon';
import Icon from '../icons/Icon';
import RefreshIcon from '../icons/RefreshIcon';
import SettingsIcon from '../icons/SettingsIcon';
import PulseRing from './PulseRing';

type HorizontalThemeProps = {
  onOpenSettings: () => void;
  onOpenDevices: () => void;
};

const HorizontalTheme = ({
  onOpenSettings,
  onOpenDevices,
}: HorizontalThemeProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const { connectedDevice, isScanning, spinAnim, sendData } = useBluetooth();
  const { commands } = useSettings();

  const [speed, setSpeed] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [steeringDirection, setSteeringDirection] = useState<
    'left' | 'right' | null
  >(null);

  // Speed management
  const speedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCommandRef = useRef<string | null>(null);

  const handleStop = useCallback(async () => {
    if (connectedDevice && lastCommandRef.current !== commands.stop) {
      await sendData(commands.stop);
      lastCommandRef.current = commands.stop;
    }
  }, [connectedDevice, commands.stop, sendData]);
  // Update speed based on acceleration/braking
  useEffect(() => {
    if (speedIntervalRef.current) {
      clearInterval(speedIntervalRef.current);
    }

    if (isBraking) {
      // Decrease speed rapidly when braking
      speedIntervalRef.current = setInterval(() => {
        setSpeed(prevSpeed => {
          const newSpeed = Math.max(0, prevSpeed - 10);
          if (newSpeed === 0) {
            handleStop();
          }
          return newSpeed;
        });
      }, 100);
    } else if (isAccelerating) {
      // Increase speed when accelerating
      speedIntervalRef.current = setInterval(() => {
        setSpeed(prevSpeed => Math.min(100, prevSpeed + 2));
      }, 100);
    } else if (speed > 0) {
      // Decrease speed gradually when not accelerating or braking
      speedIntervalRef.current = setInterval(() => {
        setSpeed(prevSpeed => {
          const newSpeed = Math.max(0, prevSpeed - 1);
          if (newSpeed === 0) {
            handleStop();
          }
          return newSpeed;
        });
      }, 200);
    }

    return () => {
      if (speedIntervalRef.current) {
        clearInterval(speedIntervalRef.current);
      }
    };
  }, [isAccelerating, isBraking, speed, handleStop]);

  // Send movement commands based on speed and steering. Steering also works
  // while stationary, so the car can turn in place.
  useEffect(() => {
    let command: string | null = null;
    if (connectedDevice) {
      if (steeringDirection === 'left') {
        command = commands.left;
      } else if (steeringDirection === 'right') {
        command = commands.right;
      } else if (speed > 0) {
        command = commands.forward;
      }
    }

    if (command) {
      // Only send if command changed
      if (command !== lastCommandRef.current) {
        sendData(command);
        lastCommandRef.current = command;
      }
    } else if (speed === 0 && lastCommandRef.current !== commands.stop) {
      handleStop();
    }
  }, [
    speed,
    steeringDirection,
    connectedDevice,
    handleStop,
    commands,
    sendData,
  ]);

  const handleAcceleratorPress = () => {
    if (!connectedDevice) {
      showNotConnectedToast();
      return;
    }
    setIsAccelerating(true);
  };

  const handleAcceleratorRelease = () => {
    setIsAccelerating(false);
  };

  const handleBrakePress = () => {
    if (!connectedDevice) {
      showNotConnectedToast();
      return;
    }
    setIsBraking(true);
  };

  const handleBrakeRelease = () => {
    setIsBraking(false);
  };

  const handleSteeringPress = (direction: 'left' | 'right') => {
    if (!connectedDevice) {
      showNotConnectedToast();
      return;
    }
    setSteeringDirection(direction);
  };

  const handleSteeringRelease = () => {
    setSteeringDirection(null);
  };

  const handleLightToggle = async () => {
    const newLightState = !isLightOn;
    if (connectedDevice) {
      await sendData(newLightState ? commands.lightOn : commands.lightOff);
      setIsLightOn(newLightState);
    } else {
      showNotConnectedToast();
    }
  };

  const hornOn = async () => {
    if (connectedDevice) {
      await sendData(commands.hornOn);
    } else {
      showNotConnectedToast();
    }
  };

  const hornOff = async () => {
    if (connectedDevice) {
      await sendData(commands.hornOff);
    }
  };

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const controlColor = isDarkMode ? '#1C1C1E' : '#F2F2F7';
  const accentColor = isDarkMode ? '#0A84FF' : '#007AFF';
  const dimColor = isDarkMode
    ? 'rgba(0, 0, 0, 0.6)'
    : 'rgba(255, 255, 255, 0.6)';

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onOpenSettings}
        >
          <SettingsIcon color={textColor} size={24} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Icon name="car" size={18} color={textColor} />
          <Text
            style={[
              styles.connectedDeviceText,
              { color: connectedDevice ? textColor : accentColor },
            ]}
            numberOfLines={1}
          >
            {connectedDevice
              ? `Connected: ${connectedDevice.name}`
              : 'Tap the Bluetooth icon to connect a device'}
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

      <View style={styles.container}>
        {/* Left side - Steering */}
        <View style={styles.leftSection}>
          <View style={styles.steeringContainer}>
            <TouchableOpacity
              style={[
                styles.steeringButton,
                { backgroundColor: controlColor },
                steeringDirection === 'left' && styles.steeringButtonActive,
              ]}
              onPressIn={() => handleSteeringPress('left')}
              onPressOut={handleSteeringRelease}
            >
              <Icon name="arrow-left" size={30} color={textColor} />
              <Text style={[styles.steeringLabel, { color: textColor }]}>
                LEFT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.steeringButton,
                { backgroundColor: controlColor },
                steeringDirection === 'right' && styles.steeringButtonActive,
              ]}
              onPressIn={() => handleSteeringPress('right')}
              onPressOut={handleSteeringRelease}
            >
              <Icon name="arrow-right" size={30} color={textColor} />
              <Text style={[styles.steeringLabel, { color: textColor }]}>
                RIGHT
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Center - Speed Display */}
        <View style={styles.centerSection}>
          <View style={styles.speedContainer}>
            <Text style={[styles.speedLabel, { color: textColor }]}>SPEED</Text>
            <Text style={[styles.speedValue, { color: textColor }]}>
              {speed}
            </Text>
            <View style={styles.speedBarContainer}>
              <View
                style={[
                  styles.speedBar,
                  {
                    width: `${speed}%`,
                    backgroundColor: speed > 70 ? '#ff4444' : '#4CAF50',
                  },
                ]}
              />
            </View>
          </View>

          {/* Utility buttons */}
          <View style={styles.utilityButtons}>
            <TouchableOpacity
              style={[styles.utilityButton, styles.hornButton]}
              onPressIn={hornOn}
              onPressOut={hornOff}
            >
              <Icon name="horn" size={24} color="#fff" />
              <Text style={[styles.utilityButtonLabel, { color: textColor }]}>
                HORN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.utilityButton,
                isLightOn ? styles.lightButtonOn : styles.lightButton,
              ]}
              onPress={handleLightToggle}
            >
              <Icon name="bulb" size={24} color={isLightOn ? '#000' : '#fff'} />
              <Text style={[styles.utilityButtonLabel, { color: textColor }]}>
                LIGHT
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right side - Accelerator & Brake */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={[
              styles.acceleratorButton,
              isAccelerating && styles.acceleratorButtonActive,
            ]}
            onPressIn={handleAcceleratorPress}
            onPressOut={handleAcceleratorRelease}
          >
            <Icon name="arrow-up" size={36} color="#fff" />
            <Text style={styles.pedalLabel}>GAS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.brakeButton, isBraking && styles.brakeButtonActive]}
            onPressIn={handleBrakePress}
            onPressOut={handleBrakeRelease}
          >
            <Icon name="arrow-down" size={36} color="#fff" />
            <Text style={styles.pedalLabel}>BRAKE</Text>
          </TouchableOpacity>
        </View>
        {!connectedDevice && (
          <View
            pointerEvents="none"
            style={[styles.disabledOverlay, { backgroundColor: dimColor }]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    height: 60,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  connectedDeviceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  connectionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionButtonConnected: {
    backgroundColor: '#34C759',
  },
  // Dim with a translucent overlay: opacity on the container makes Android
  // draw it offscreen, which distorts rounded/clipped views like the D-pad.
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  steeringContainer: {
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
  steeringButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#666',
  },
  steeringButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#45a049',
  },
  steeringLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 3,
  },
  speedContainer: {
    alignItems: 'center',
    width: '100%',
  },
  speedLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  speedValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  speedBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
  speedBar: {
    height: '100%',
    borderRadius: 10,
  },
  utilityButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  utilityButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  utilityButtonLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 1,
  },
  hornButton: {
    backgroundColor: '#FF9800',
    borderColor: '#F57C00',
  },
  lightButton: {
    backgroundColor: '#757575',
    borderColor: '#616161',
  },
  lightButtonOn: {
    backgroundColor: '#FFC107',
    borderColor: '#FFA000',
  },
  acceleratorButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#388E3C',
  },
  acceleratorButtonActive: {
    backgroundColor: '#45a049',
    transform: [{ scale: 0.95 }],
  },
  brakeButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#c62828',
  },
  brakeButtonActive: {
    backgroundColor: '#da190b',
    transform: [{ scale: 0.95 }],
  },
  pedalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 3,
  },
});

export default HorizontalTheme;

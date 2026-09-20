import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useBluetooth } from '../contexts/BluetoothContext';
import { useSettings } from '../contexts/SettingsContext';
import { showNotConnectedToast } from '../utils/toast';
import BluetoothIcon from '../icons/BluetoothIcon';
import Icon from '../icons/Icon';
import RefreshIcon from '../icons/RefreshIcon';
import SettingsIcon from '../icons/SettingsIcon';
import { space, typography, useColors, fullRadius } from '../theme';
import IconButton from './IconButton';
import PulseRing from './PulseRing';
import { PedalButton, SteeringButton, UtilityButton } from './ControlButtons';

type HorizontalThemeProps = {
  onOpenSettings: () => void;
  onOpenDevices: () => void;
};

const HorizontalTheme = ({
  onOpenSettings,
  onOpenDevices,
}: HorizontalThemeProps) => {
  const c = useColors();
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

  return (
    <View style={[styles.root, { backgroundColor: c.surface }]}>
      <View style={[styles.header, { backgroundColor: c.surfaceContainerLow }]}>
        <IconButton
          variant="ghost"
          size={40}
          onPress={onOpenSettings}
          accessibilityLabel="Settings"
        >
          {color => <SettingsIcon color={color} size={24} />}
        </IconButton>

        <View style={styles.titleContainer}>
          <Icon name="car" size={18} color={c.onSurface} />
          <Text
            style={[
              typography.labelLarge,
              { color: connectedDevice ? c.onSurface : c.primary },
            ]}
            numberOfLines={1}
          >
            {connectedDevice
              ? `Connected: ${connectedDevice.name}`
              : 'Tap the Bluetooth icon to connect a device'}
          </Text>
        </View>

        <IconButton
          variant="filled"
          tone={connectedDevice ? 'success' : 'primary'}
          size={44}
          onPress={onOpenDevices}
          accessibilityLabel="Devices"
        >
          {color => (
            <>
              <PulseRing
                active={!connectedDevice && !isScanning}
                color={c.primary}
              />
              {isScanning ? (
                <RefreshIcon color={color} spinAnim={spinAnim} />
              ) : (
                <BluetoothIcon color={color} size={24} />
              )}
            </>
          )}
        </IconButton>
      </View>

      <View style={styles.container}>
        {/* Left side - Steering */}
        <View style={styles.leftSection}>
          <View style={styles.steeringContainer}>
            <SteeringButton
              direction="left"
              active={steeringDirection === 'left'}
              onPressIn={() => handleSteeringPress('left')}
              onPressOut={handleSteeringRelease}
            />
            <SteeringButton
              direction="right"
              active={steeringDirection === 'right'}
              onPressIn={() => handleSteeringPress('right')}
              onPressOut={handleSteeringRelease}
            />
          </View>
        </View>

        {/* Center - Speed Display */}
        <View style={styles.centerSection}>
          <View style={styles.speedContainer}>
            <Text
              style={[
                typography.titleMedium,
                styles.speedLabel,
                { color: c.onSurface },
              ]}
            >
              SPEED
            </Text>
            <Text
              style={[
                typography.displayMedium,
                styles.speedValue,
                { color: c.onSurface },
              ]}
            >
              {speed}
            </Text>
            <View
              style={[
                styles.speedBarContainer,
                { backgroundColor: c.surfaceContainerHighest },
              ]}
            >
              <View
                style={[
                  styles.speedBar,
                  {
                    width: `${speed}%`,
                    backgroundColor: speed > 70 ? c.error : c.success,
                  },
                ]}
              />
            </View>
          </View>

          {/* Utility buttons */}
          <View style={styles.utilityButtons}>
            <UtilityButton
              kind="horn"
              size={64}
              onPressIn={hornOn}
              onPressOut={hornOff}
            />
            <UtilityButton
              kind="light"
              size={64}
              on={isLightOn}
              onPress={handleLightToggle}
            />
          </View>
        </View>

        {/* Right side - Accelerator & Brake */}
        <View style={styles.rightSection}>
          <PedalButton
            kind="gas"
            active={isAccelerating}
            onPressIn={handleAcceleratorPress}
            onPressOut={handleAcceleratorRelease}
          />
          <PedalButton
            kind="brake"
            active={isBraking}
            onPressIn={handleBrakePress}
            onPressOut={handleBrakeRelease}
          />
        </View>
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
    paddingHorizontal: space[4],
    height: 60,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  // Dim with a translucent overlay: opacity on the container makes Android
  // draw it offscreen, which distorts rounded/clipped views like the D-pad.
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: space[4],
    gap: space[4],
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
    gap: space[3],
  },
  steeringContainer: {
    gap: space[4],
    width: '100%',
    alignItems: 'center',
  },
  speedContainer: {
    alignItems: 'center',
    width: '100%',
  },
  speedLabel: {
    marginBottom: space[1],
  },
  speedValue: {
    marginBottom: 10,
  },
  speedBarContainer: {
    width: '100%',
    height: 20,
    borderRadius: fullRadius(20),
    overflow: 'hidden',
  },
  speedBar: {
    height: '100%',
    borderRadius: fullRadius(20),
  },
  utilityButtons: {
    flexDirection: 'row',
    gap: space[4],
  },
});

export default HorizontalTheme;

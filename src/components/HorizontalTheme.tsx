import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { useBluetooth } from '../contexts/BluetoothContext';
import { useSettings } from '../contexts/SettingsContext';

const HorizontalTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { connectedDevice, sendData } = useBluetooth();
  const { commands } = useSettings();

  const [speed, setSpeed] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [steeringDirection, setSteeringDirection] = useState<
    'left' | 'right' | null
  >(null);

  // Lock orientation to landscape when component mounts
  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      // Unlock orientation when component unmounts
      Orientation.unlockAllOrientations();
    };
  }, []);

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

  // Send movement commands based on speed and steering
  useEffect(() => {
    if (speed > 0 && connectedDevice) {
      let command: string | null = null;

      if (steeringDirection === 'left') {
        command = commands.left;
      } else if (steeringDirection === 'right') {
        command = commands.right;
      } else {
        command = commands.forward;
      }

      // Only send if command changed
      if (command && command !== lastCommandRef.current) {
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
    setIsAccelerating(true);
  };

  const handleAcceleratorRelease = () => {
    setIsAccelerating(false);
  };

  const handleBrakePress = () => {
    setIsBraking(true);
  };

  const handleBrakeRelease = () => {
    setIsBraking(false);
  };

  const handleSteeringPress = (direction: 'left' | 'right') => {
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
    }
  };

  const hornOn = async () => {
    if (connectedDevice) {
      await sendData(commands.hornOn);
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

  return (
    <View style={[styles.container, { backgroundColor }]}>
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
            disabled={!connectedDevice || speed === 0}
          >
            <Text style={[styles.steeringText, { color: textColor }]}>⬅️</Text>
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
            disabled={!connectedDevice || speed === 0}
          >
            <Text style={[styles.steeringText, { color: textColor }]}>➡️</Text>
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
          <Text style={[styles.speedValue, { color: textColor }]}>{speed}</Text>
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
            disabled={!connectedDevice}
          >
            <Text style={styles.utilityButtonText}>📯</Text>
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
            disabled={!connectedDevice}
          >
            <Text style={styles.utilityButtonText}>💡</Text>
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
          disabled={!connectedDevice}
        >
          <Text style={styles.pedalText}>⬆️</Text>
          <Text style={styles.pedalLabel}>GAS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.brakeButton, isBraking && styles.brakeButtonActive]}
          onPressIn={handleBrakePress}
          onPressOut={handleBrakeRelease}
          disabled={!connectedDevice}
        >
          <Text style={styles.pedalText}>⬇️</Text>
          <Text style={styles.pedalLabel}>BRAKE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    gap: 20,
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
    gap: 20,
  },
  steeringContainer: {
    gap: 30,
    width: '100%',
    alignItems: 'center',
  },
  steeringButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#666',
  },
  steeringButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#45a049',
  },
  steeringText: {
    fontSize: 40,
  },
  steeringLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  speedContainer: {
    alignItems: 'center',
    width: '100%',
  },
  speedLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  speedValue: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  speedBarContainer: {
    width: '100%',
    height: 30,
    backgroundColor: '#333',
    borderRadius: 15,
    overflow: 'hidden',
  },
  speedBar: {
    height: '100%',
    borderRadius: 15,
  },
  utilityButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  utilityButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  utilityButtonText: {
    fontSize: 32,
  },
  utilityButtonLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
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
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#388E3C',
  },
  acceleratorButtonActive: {
    backgroundColor: '#45a049',
    transform: [{ scale: 0.95 }],
  },
  brakeButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#c62828',
  },
  brakeButtonActive: {
    backgroundColor: '#da190b',
    transform: [{ scale: 0.95 }],
  },
  pedalText: {
    fontSize: 48,
  },
  pedalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
});

export default HorizontalTheme;

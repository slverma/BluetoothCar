/**
 * Bluetooth Car Controller App
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BTPanel from './BTPanel';
import { BluetoothProvider } from './contexts/BluetoothContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { useColors } from './theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = useColors();

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <BluetoothProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={colors.surfaceContainerLow}
          />
          <BTPanel />
        </BluetoothProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;

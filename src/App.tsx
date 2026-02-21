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

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <BluetoothProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={isDarkMode ? '#000' : '#fff'}
          />
          <BTPanel />
        </BluetoothProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;

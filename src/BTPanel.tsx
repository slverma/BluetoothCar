import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import BTDevices from './BTDevices';
import { useSettings } from './contexts/SettingsContext';
import HorizontalTheme from './components/HorizontalTheme';
import SettingsModal from './components/SettingsModal';
import VerticalTheme from './components/VerticalTheme';

export default function BTPanel() {
  const { theme } = useSettings();

  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Each theme owns its orientation; unlocking would leave a vertical layout
  // stuck in landscape if the phone is still held sideways.
  useEffect(() => {
    if (theme === 'horizontal') {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, [theme]);

  console.log('BTPanel rendering with theme:', theme);

  const Theme = theme === 'horizontal' ? HorizontalTheme : VerticalTheme;

  return (
    <View style={styles.container}>
      <BTDevices showModal={showModal} setShowModal={setShowModal} />
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      <Theme
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenDevices={() => setShowModal(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

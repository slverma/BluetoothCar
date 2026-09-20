import React, { useState, useEffect, JSX } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useSettings,
  ThemeType,
  CommandSettings,
} from '../contexts/SettingsContext';
import Icon, { IconName } from '../icons/Icon';
import SettingsIcon from '../icons/SettingsIcon';
import { elevation, shape, space, typography, useColors } from '../theme';
import { Button } from './Button';
import IconButton from './IconButton';
import ThemeCard from './ThemeCard';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ThemeOption {
  value: ThemeType;
  label: string;
  icon: IconName;
  description: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'vertical',
    label: 'Vertical',
    icon: 'phone',
    description: 'Classic D-Pad controls',
  },
  {
    value: 'horizontal',
    label: 'Horizontal',
    icon: 'car',
    description: 'Car-style controls',
  },
  // Add more themes here in the future:
  // {
  //   value: 'gamepad',
  //   label: 'Gamepad',
  //   icon: '🎮',
  //   description: 'Console-style layout',
  // },
  // {
  //   value: 'joystick',
  //   label: 'Joystick',
  //   icon: '🕹️',
  //   description: 'Virtual joystick',
  // },
];

const commandLabels: Record<
  keyof CommandSettings,
  { icon: IconName; label: string }
> = {
  forward: { icon: 'arrow-up', label: 'Forward' },
  backward: { icon: 'arrow-down', label: 'Backward' },
  left: { icon: 'arrow-left', label: 'Left' },
  right: { icon: 'arrow-right', label: 'Right' },
  stop: { icon: 'stop', label: 'Stop' },
  hornOn: { icon: 'horn', label: 'Horn On' },
  hornOff: { icon: 'horn-off', label: 'Horn Off' },
  lightOn: { icon: 'bulb', label: 'Light On' },
  lightOff: { icon: 'bulb-off', label: 'Light Off' },
};

export default function SettingsModal({
  visible,
  onClose,
}: SettingsModalProps): JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const c = useColors();
  const { commands, theme, updateCommand, updateTheme, resetToDefaults } =
    useSettings();

  const [editedCommands, setEditedCommands] = useState(commands);
  const [editedTheme, setEditedTheme] = useState<ThemeType>(theme);

  // Sync editedCommands when modal becomes visible or commands change
  useEffect(() => {
    if (visible) {
      console.log('Settings modal opened, current commands:', commands);
      setEditedCommands(commands);
      setEditedTheme(theme);
    }
  }, [visible, commands, theme]);

  const handleSave = async () => {
    console.log('Saving settings...');
    console.log('Current theme:', theme);
    console.log('Edited theme:', editedTheme);

    // Save theme if changed (do this first)
    if (editedTheme !== theme) {
      console.log('Updating theme to:', editedTheme);
      await updateTheme(editedTheme);
    }

    // Save all commands
    const keys = Object.keys(editedCommands) as Array<keyof typeof commands>;
    for (const key of keys) {
      if (editedCommands[key] !== commands[key]) {
        await updateCommand(key, editedCommands[key]);
      }
    }

    console.log('Settings saved, closing modal');
    onClose();
  };

  const handleReset = async () => {
    await resetToDefaults();
    setEditedCommands({
      forward: 'F',
      backward: 'B',
      left: 'L',
      right: 'R',
      stop: 'S',
      hornOn: 'O',
      hornOff: 'o',
      lightOn: 'T',
      lightOff: 't',
    });
    setEditedTheme('vertical');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: c.scrim }]}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: c.surfaceContainerHighest,
              paddingBottom: safeAreaInsets.bottom,
            },
            elevation[3],
          ]}
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            <View style={styles.modalHeader}>
              <View style={styles.titleRow}>
                <SettingsIcon color={c.onSurface} size={26} />
                <Text
                  style={[typography.headlineSmall, { color: c.onSurface }]}
                >
                  Command Settings
                </Text>
              </View>
              <IconButton
                variant="ghost"
                onPress={onClose}
                accessibilityLabel="Close settings"
              >
                {color => <Icon name="close" size={28} color={color} />}
              </IconButton>
            </View>

            <Text
              style={[
                typography.bodyMedium,
                styles.description,
                { color: c.onSurfaceVariant },
              ]}
            >
              Configure the commands sent to your Bluetooth device
            </Text>

            {/* Theme Selection */}
            <View style={styles.themeSection}>
              <View style={styles.sectionTitleRow}>
                <Icon name="palette" size={20} color={c.onSurface} />
                <Text style={[typography.titleMedium, { color: c.onSurface }]}>
                  Theme
                </Text>
              </View>
              <Text
                style={[
                  typography.bodyMedium,
                  styles.themeSectionSubtitle,
                  { color: c.onSurfaceVariant },
                ]}
              >
                Choose your preferred control layout
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.themeScrollContent}
              >
                {THEME_OPTIONS.map(themeOption => (
                  <ThemeCard
                    key={themeOption.value}
                    label={themeOption.label}
                    description={themeOption.description}
                    icon={themeOption.icon}
                    selected={editedTheme === themeOption.value}
                    onPress={() => setEditedTheme(themeOption.value)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.sectionTitleRow}>
              <Icon name="list" size={20} color={c.onSurface} />
              <Text style={[typography.titleMedium, { color: c.onSurface }]}>
                Commands
              </Text>
            </View>

            <View style={styles.commandsList}>
              {(
                Object.keys(commandLabels) as Array<keyof typeof commandLabels>
              ).map(key => (
                <View key={key} style={styles.commandItem}>
                  <View style={styles.commandLabelContainer}>
                    <Icon
                      name={commandLabels[key].icon}
                      size={18}
                      color={c.onSurface}
                    />
                    <Text
                      style={[typography.labelLarge, { color: c.onSurface }]}
                    >
                      {commandLabels[key].label}
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      typography.bodyLarge,
                      styles.commandInput,
                      {
                        backgroundColor: c.surfaceContainer,
                        color: c.onSurface,
                        borderColor: c.outline,
                      },
                    ]}
                    value={editedCommands[key]}
                    onChangeText={text =>
                      setEditedCommands({ ...editedCommands, [key]: text })
                    }
                    placeholder={`Enter ${key} command`}
                    placeholderTextColor={c.onSurfaceVariant}
                    maxLength={20}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                label="Reset to Defaults"
                tone="error"
                onPress={handleReset}
              />
              <Button
                label="Save Changes"
                tone="success"
                onPress={handleSave}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space[5],
  },
  modalContent: {
    borderRadius: shape.xl,
    width: '100%',
    maxWidth: 600,
    maxHeight: '100%',
    overflow: 'hidden',
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  scrollContent: {
    padding: space[5],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[3],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  description: {
    marginBottom: space[5],
  },
  themeSection: {
    marginBottom: space[6],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    marginBottom: space[3],
  },
  themeSectionSubtitle: {
    marginBottom: space[3],
    marginTop: -space[2],
  },
  // Padding leaves room for the cards' elevation shadow, which the horizontal
  // scroll view would otherwise clip.
  themeScrollContent: {
    paddingVertical: space[2],
    paddingHorizontal: space[1],
    gap: space[3],
  },
  commandsList: {
    marginBottom: space[5],
  },
  commandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space[4],
    gap: space[3],
  },
  commandLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minWidth: 100,
  },
  commandInput: {
    paddingVertical: space[2],
    paddingHorizontal: space[4],
    borderRadius: shape.sm,
    borderWidth: 1,
    flex: 1.5,
    minWidth: 80,
  },
  buttonContainer: {
    gap: space[3],
    marginTop: space[2],
  },
});

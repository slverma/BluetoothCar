import React, { useState, useEffect, JSX } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings, ThemeType } from '../contexts/SettingsContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ThemeOption {
  value: ThemeType;
  label: string;
  icon: string;
  description: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'vertical',
    label: 'Vertical',
    icon: '📱',
    description: 'Classic D-Pad controls',
  },
  {
    value: 'horizontal',
    label: 'Horizontal',
    icon: '🏎️',
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

const commandLabels = {
  forward: '⬆️ Forward',
  backward: '⬇️ Backward',
  left: '⬅️ Left',
  right: '➡️ Right',
  stop: '⏹️ Stop',
  hornOn: '📯 Horn On',
  hornOff: '🔇 Horn Off',
  lightOn: '💡 Light On',
  lightOff: '🌑 Light Off',
};

export default function SettingsModal({
  visible,
  onClose,
}: SettingsModalProps): JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
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

  const backgroundColor = isDarkMode ? '#1C1C1E' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBackgroundColor = isDarkMode ? '#2C2C2E' : '#F2F2F7';
  const borderColor = isDarkMode ? '#3A3A3C' : '#E5E5EA';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor,
              paddingBottom: safeAreaInsets.bottom,
            },
          ]}
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                ⚙️ Command Settings
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.closeButton, { color: textColor }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.description, { color: textColor }]}>
              Configure the commands sent to your Bluetooth device
            </Text>

            {/* Theme Selection */}
            <View style={styles.themeSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                🎨 Theme
              </Text>
              <Text style={[styles.themeSectionSubtitle, { color: textColor }]}>
                Choose your preferred control layout
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.themeScrollContent}
              >
                {THEME_OPTIONS.map(themeOption => (
                  <TouchableOpacity
                    key={themeOption.value}
                    style={[
                      styles.themeCard,
                      {
                        backgroundColor: inputBackgroundColor,
                        borderColor: borderColor,
                      },
                      editedTheme === themeOption.value &&
                        styles.themeCardActive,
                    ]}
                    onPress={() => setEditedTheme(themeOption.value)}
                  >
                    {editedTheme === themeOption.value && (
                      <View style={styles.themeCheckmark}>
                        <Text style={styles.themeCheckmarkText}>✓</Text>
                      </View>
                    )}
                    <View style={styles.themeIconContainer}>
                      <Text style={styles.themeIcon}>{themeOption.icon}</Text>
                    </View>
                    <Text
                      style={[
                        styles.themeCardTitle,
                        { color: textColor },
                        editedTheme === themeOption.value &&
                          styles.themeCardTitleActive,
                      ]}
                    >
                      {themeOption.label}
                    </Text>
                    <Text
                      style={[
                        styles.themeCardDescription,
                        { color: textColor },
                      ]}
                    >
                      {themeOption.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={[styles.sectionTitle, { color: textColor }]}>
              📝 Commands
            </Text>

            <View style={styles.commandsList}>
              {(
                Object.keys(commandLabels) as Array<keyof typeof commandLabels>
              ).map(key => (
                <View key={key} style={styles.commandItem}>
                  <Text style={[styles.commandLabel, { color: textColor }]}>
                    {commandLabels[key]}
                  </Text>
                  <TextInput
                    style={[
                      styles.commandInput,
                      {
                        backgroundColor: inputBackgroundColor,
                        color: textColor,
                        borderColor: borderColor,
                      },
                    ]}
                    value={editedCommands[key]}
                    onChangeText={text =>
                      setEditedCommands({ ...editedCommands, [key]: text })
                    }
                    placeholder={`Enter ${key} command`}
                    placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                    maxLength={20}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset to Defaults</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 600,
    maxHeight: '100%',
    overflow: 'hidden',
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  scrollContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
    paddingHorizontal: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
  },
  themeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  themeSectionSubtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 12,
    marginTop: -8,
  },
  themeScrollContent: {
    paddingVertical: 4,
    gap: 12,
  },
  themeCard: {
    width: 140,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    position: 'relative',
  },
  themeCardActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  themeCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCheckmarkText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeIconContainer: {
    marginBottom: 8,
  },
  themeIcon: {
    fontSize: 40,
  },
  themeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  themeCardTitleActive: {
    color: '#fff',
  },
  themeCardDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 16,
  },
  commandsList: {
    marginBottom: 20,
  },
  commandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  commandLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    minWidth: 100,
  },
  commandInput: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1.5,
    minWidth: 80,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

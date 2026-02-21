import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'vertical' | 'horizontal';

export interface CommandSettings {
  forward: string;
  backward: string;
  left: string;
  right: string;
  stop: string;
  hornOn: string;
  hornOff: string;
  lightOn: string;
  lightOff: string;
}

export interface Settings {
  commands: CommandSettings;
  theme: ThemeType;
}

const DEFAULT_COMMANDS: CommandSettings = {
  forward: 'F',
  backward: 'B',
  left: 'L',
  right: 'R',
  stop: 'S',
  hornOn: 'O',
  hornOff: 'o',
  lightOn: 'T',
  lightOff: 't',
};

const STORAGE_KEY = '@bluetooth_car_settings';

interface SettingsContextType {
  commands: CommandSettings;
  theme: ThemeType;
  updateCommand: (key: keyof CommandSettings, value: string) => Promise<void>;
  updateTheme: (theme: ThemeType) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [commands, setCommands] = useState<CommandSettings>(DEFAULT_COMMANDS);
  const [theme, setTheme] = useState<ThemeType>('vertical');
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading settings from AsyncStorage...');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Stored value:', stored);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        console.log('Parsed settings:', parsedSettings);
        if (parsedSettings.commands) {
          setCommands({ ...DEFAULT_COMMANDS, ...parsedSettings.commands });
        }
        if (parsedSettings.theme) {
          setTheme(parsedSettings.theme);
        }
      } else {
        console.log('No stored settings found, using defaults');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (
    newCommands: CommandSettings,
    newTheme: ThemeType,
  ) => {
    try {
      const settings: Settings = { commands: newCommands, theme: newTheme };
      console.log('Saving settings to AsyncStorage:', settings);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateCommand = useCallback(
    async (key: keyof CommandSettings, value: string) => {
      const newCommands = { ...commands, [key]: value };
      setCommands(newCommands);
      await saveSettings(newCommands, theme);
    },
    [commands, theme],
  );

  const updateTheme = useCallback(
    async (newTheme: ThemeType) => {
      setTheme(newTheme);
      await saveSettings(commands, newTheme);
    },
    [commands, setTheme],
  );

  const resetToDefaults = useCallback(async () => {
    setCommands(DEFAULT_COMMANDS);
    setTheme('vertical');
    await saveSettings(DEFAULT_COMMANDS, 'vertical');
  }, []);

  const value: SettingsContextType = {
    commands,
    theme,
    updateCommand,
    updateTheme,
    resetToDefaults,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

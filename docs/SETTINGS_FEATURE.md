# Settings Feature - Custom Command Configuration

## Overview

The settings feature allows users to customize the commands sent to their Bluetooth devices. Instead of being limited to the default commands (F, B, L, R, S, etc.), users can now configure their own command strings.

## Features

### 1. **Settings Context** (`src/contexts/SettingsContext.tsx`)

- Manages command settings globally across the app
- Persists settings using AsyncStorage
- Provides default commands that can be customized
- Includes reset functionality to restore defaults

### 2. **Settings Modal** (`src/components/SettingsModal.tsx`)

- User-friendly interface to configure all commands
- Supports the following commands:
  - ⬆️ Forward
  - ⬇️ Backward
  - ⬅️ Left
  - ➡️ Right
  - ⏹️ Stop
  - 📯 Horn On
  - 🔇 Horn Off
  - 💡 Light On
  - 🌑 Light Off
- Real-time editing with immediate save
- Reset to defaults option
- Dark mode support

### 3. **Settings Icon** (`src/icons/SettingsIcon.tsx`)

- Custom SVG gear icon
- Positioned in the top-left corner of the main screen

## Default Commands

```typescript
{
  forward: 'F',
  backward: 'B',
  left: 'L',
  right: 'R',
  stop: 'S',
  hornOn: 'O',
  hornOff: 'o',
  lightOn: 'T',
  lightOff: 't',
}
```

## Usage

### For Users:

1. Tap the ⚙️ (gear) icon in the top-left corner
2. Edit any command field with your custom command string
3. Tap "Save Changes" to apply
4. Use "Reset to Defaults" to restore original commands

### For Developers:

The settings are automatically integrated:

```typescript
// In your component
import { useSettings } from './contexts/SettingsContext';

function MyComponent() {
  const { commands } = useSettings();

  // Use configured commands
  await sendData(commands.forward); // Sends user's configured forward command
}
```

## Persistence

- Settings are saved to AsyncStorage with key `@bluetooth_car_commands`
- Persists across app restarts
- Automatically loads saved settings on app launch

## Integration Points

1. **App.tsx** - Wrapped with `SettingsProvider`
2. **BTPanel.tsx** - Uses `useSettings()` hook to get configured commands
3. All control handlers updated to use `commands.{action}` instead of hardcoded strings

## Benefits

- **Flexibility**: Support different Bluetooth devices with different command protocols
- **User Control**: Users can adapt the app to their specific hardware
- **Easy to Use**: Simple, intuitive interface for configuration
- **Persistent**: Settings saved and loaded automatically
- **Safe**: Includes validation and reset functionality

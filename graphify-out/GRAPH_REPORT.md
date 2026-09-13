# Graph Report - .  (2026-09-13)

## Corpus Check
- 76 files · ~98,045 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 216 nodes · 271 edges · 26 communities (24 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.88)
- Token cost: 196,534 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Theme & Settings|UI Theme & Settings]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Bluetooth Connection Managers|Bluetooth Connection Managers]]
- [[_COMMUNITY_Dev Tooling Dependencies|Dev Tooling Dependencies]]
- [[_COMMUNITY_Native App Bootstrap|Native App Bootstrap]]
- [[_COMMUNITY_Vehicle Control Handlers|Vehicle Control Handlers]]
- [[_COMMUNITY_Settings Data Model|Settings Data Model]]
- [[_COMMUNITY_Build & Test Config|Build & Test Config]]
- [[_COMMUNITY_Bonded Devices & Permissions|Bonded Devices & Permissions]]
- [[_COMMUNITY_iOS App Delegate|iOS App Delegate]]
- [[_COMMUNITY_App Manifest & Entry|App Manifest & Entry]]
- [[_COMMUNITY_D-Pad Control UI|D-Pad Control UI]]
- [[_COMMUNITY_Settings Persistence Actions|Settings Persistence Actions]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_iOS Icon Metadata|iOS Icon Metadata]]
- [[_COMMUNITY_iOS Icon Metadata|iOS Icon Metadata]]
- [[_COMMUNITY_Metro Bundler Config|Metro Bundler Config]]
- [[_COMMUNITY_Prettier Formatting Config|Prettier Formatting Config]]

## God Nodes (most connected - your core abstractions)
1. `BTPanel()` - 13 edges
2. `BluetoothProvider.sendData` - 13 edges
3. `package.json project manifest` - 10 edges
4. `ClassicBluetoothManager` - 9 edges
5. `Bluetooth Car Controller (README)` - 9 edges
6. `scripts` - 8 edges
7. `classicBTManager` - 8 edges
8. `useBluetooth()` - 7 edges
9. `useSettings()` - 7 edges
10. `bleManager` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Bluetooth Permission (rationale)` --references--> `requestBlePermissions()`  [INFERRED]
  docs/index.html → src/ble/permissions.ts
- `Location Permission (rationale)` --references--> `requestBlePermissions()`  [INFERRED]
  docs/index.html → src/ble/permissions.ts
- `AppDelegate` --shares_data_with--> `app.json (Bluetooth Car app manifest)`  [AMBIGUOUS]
  ios/bluetothcar/AppDelegate.swift → app.json
- `Bluetooth Car Controller (README)` --references--> `bleManager`  [EXTRACTED]
  README.md → src/ble/bleManager.ts
- `Bluetooth Car Controller (README)` --references--> `requestBlePermissions()`  [EXTRACTED]
  README.md → src/ble/permissions.ts

## Hyperedges (group relationships)
- **Bluetooth Connectivity & Permissions Stack** — package_react_native_ble_plx, package_react_native_bluetooth_classic, package_react_native_permissions [INFERRED 0.80]
- **React Native Cross-Platform App Bootstrap** — index_registercomponent, bluetothcar_appdelegate_appdelegate, bluetoothcar_mainactivity_mainactivity [INFERRED 0.85]
- **React Native Toolchain Configuration** — jest_config_preset, babel_config_presets, metro_config_config, tsconfig_config, eslintrc_config [INFERRED 0.75]
- **Vertical vs horizontal theme control-handler duplication** — src_btpanel_btpanel, components_horizontaltheme_horizontaltheme, contexts_settingscontext_settingsprovider [INFERRED 0.75]
- **Unified BLE + Classic Bluetooth device abstraction** — contexts_bluetoothcontext_bluetoothprovider, ble_blemanager_blemanager, ble_classicbtmanager_classicbtmanager [EXTRACTED 1.00]
- **Duplicate/dead bonded-device lookup implementations** — ble_bondeddevices_getbondeddevices, ble_classicbtmanager_getbondeddevices, ble_classicbtmanager_classicbluetoothmanager [INFERRED 0.75]

## Communities (26 total, 2 thin omitted)

### Community 0 - "UI Theme & Settings"
Cohesion: 0.14
Nodes (21): HorizontalTheme(), styles, SettingsModal(), BluetoothProvider(), useBluetooth(), SettingsProvider.loadSettings, SettingsProvider(), useSettings() (+13 more)

### Community 1 - "Runtime Dependencies"
Cohesion: 0.08
Nodes (23): dependencies, react, react-native, @react-native-async-storage/async-storage, react-native-ble-plx, react-native-bluetooth-classic, react-native-orientation-locker, react-native-permissions (+15 more)

### Community 2 - "Bluetooth Connection Managers"
Cohesion: 0.14
Nodes (10): bleManager, ClassicBluetoothManager, classicBTManager, BluetoothContext, BluetoothContextType, BluetoothProvider.connectToDevice, BluetoothProvider.disconnectDevice, BluetoothProvider.stopScan (+2 more)

### Community 3 - "Dev Tooling Dependencies"
Cohesion: 0.10
Nodes (20): devDependencies, @babel/core, @babel/preset-env, @babel/runtime, eslint, jest, prettier, @react-native/babel-preset (+12 more)

### Community 4 - "Native App Bootstrap"
Cohesion: 0.12
Nodes (10): android/build.gradle root buildscript, gradlew POSIX start script, android/settings.gradle root project settings, android/app/build.gradle app module config, app.json (Bluetooth Car app manifest), AppIcon.appiconset icon set manifest, MainActivity, MainApplication (+2 more)

### Community 5 - "Vehicle Control Handlers"
Cohesion: 0.23
Nodes (14): DPad.handlePress, HorizontalTheme.handleLightToggle, HorizontalTheme.handleStop, HorizontalTheme.hornOff, HorizontalTheme.hornOn, BluetoothProvider.sendData, BTPanel.handleBackwardPress, BTPanel.handleForwardPress (+6 more)

### Community 6 - "Settings Data Model"
Cohesion: 0.15
Nodes (12): commandLabels, SettingsModalProps, styles, THEME_OPTIONS, ThemeOption, CommandSettings, DEFAULT_COMMANDS, Settings (+4 more)

### Community 7 - "Build & Test Config"
Cohesion: 0.20
Nodes (12): babel.config.js presets, .eslintrc.js lint config, jest.config.js react-native preset, metro.config.js Metro bundler config, @react-native-async-storage/async-storage dependency, package.json project manifest, react-native-ble-plx (BLE) dependency, react-native-bluetooth-classic dependency (+4 more)

### Community 8 - "Bonded Devices & Permissions"
Cohesion: 0.22
Nodes (8): BondedDevice, getBondedDevices(), ClassicBluetoothManager.getBondedDevices, requestBlePermissions(), BluetoothProvider.startScan, Bluetooth Permission (rationale), Location Permission (rationale), BluetoothCar Privacy Policy

### Community 9 - "iOS App Delegate"
Cohesion: 0.31
Nodes (5): AppDelegate, ReactNativeDelegate, RCTDefaultReactNativeFactoryDelegate, UIApplicationDelegate, UIResponder

### Community 10 - "App Manifest & Entry"
Cohesion: 0.29
Nodes (6): displayName, icon, name, slug, splash, image

### Community 11 - "D-Pad Control UI"
Cohesion: 0.33
Nodes (5): DPad(), Props, styles, ArrowIcon(), ArrowIconProps

### Community 12 - "Settings Persistence Actions"
Cohesion: 0.40
Nodes (6): SettingsModal.handleReset, SettingsModal.handleSave, SettingsProvider.resetToDefaults, SettingsProvider.saveSettings, SettingsProvider.updateCommand, SettingsProvider.updateTheme

### Community 13 - "TypeScript Config"
Cohesion: 0.33
Nodes (5): compilerOptions, types, exclude, extends, include

### Community 14 - "iOS Icon Metadata"
Cohesion: 0.40
Nodes (4): images, info, author, version

### Community 15 - "iOS Icon Metadata"
Cohesion: 0.50
Nodes (3): info, author, version

## Ambiguous Edges - Review These
- `AppDelegate` → `app.json (Bluetooth Car app manifest)`  [AMBIGUOUS]
  ios/bluetothcar/AppDelegate.swift · relation: shares_data_with

## Knowledge Gaps
- **87 isolated node(s):** `slug`, `displayName`, `icon`, `image`, `{ getDefaultConfig, mergeConfig }` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `AppDelegate` and `app.json (Bluetooth Car app manifest)`?**
  _Edge tagged AMBIGUOUS (relation: shares_data_with) - confidence is low._
- **Why does `classicBTManager` connect `Bluetooth Connection Managers` to `UI Theme & Settings`, `Vehicle Control Handlers`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `BluetoothProvider.sendData` connect `Vehicle Control Handlers` to `Bluetooth Connection Managers`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `Bluetooth Car Controller (README)` connect `UI Theme & Settings` to `Bonded Devices & Permissions`, `Bluetooth Connection Managers`, `D-Pad Control UI`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `slug`, `displayName`, `icon` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Theme & Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.1354679802955665 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
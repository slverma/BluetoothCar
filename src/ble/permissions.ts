import { PermissionsAndroid, Platform } from 'react-native';

export async function requestBlePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const apiLevel = Platform.Version;

  if (apiLevel >= 31) {
    // Android 12+ (API 31+)
    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ];

    const result = await PermissionsAndroid.requestMultiple(permissions);

    const allGranted = Object.values(result).every(
      status => status === PermissionsAndroid.RESULTS.GRANTED,
    );

    console.log('Permission results:', result);
    return allGranted;
  } else {
    // Android 11 and below
    const permissions = [
      // PermissionsAndroid.PERMISSIONS.BLUETOOTH,
      // PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];

    const result = await PermissionsAndroid.requestMultiple(permissions);

    console.log('Permission results:', result);
    return Object.values(result).every(
      status => status === PermissionsAndroid.RESULTS.GRANTED,
    );
  }
}

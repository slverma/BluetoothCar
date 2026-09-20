import { ToastAndroid } from 'react-native';

const NOT_CONNECTED_MESSAGE =
  'Connect a Bluetooth device first by tapping the Bluetooth icon';
const COOLDOWN_MS = 2500;

let lastShownAt = 0;

// Native toasts queue up, so ignore presses while the last one is still showing
// (e.g. a held D-pad arrow).
export function showNotConnectedToast() {
  const now = Date.now();
  if (now - lastShownAt < COOLDOWN_MS) {
    return;
  }
  lastShownAt = now;
  ToastAndroid.show(NOT_CONNECTED_MESSAGE, ToastAndroid.SHORT);
}

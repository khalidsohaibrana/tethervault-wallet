import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';

const PIN_HASH_KEY = 'tethervault_pin_hash_v1';
const PIN_SALT_KEY = 'tethervault_pin_salt_v1';
const BIOMETRIC_ENABLED_KEY = 'tethervault_biometric_enabled_v1';

export type BiometricStatus = {
  available: boolean;
  enrolled: boolean;
  enabled: boolean;
  label: string;
};

export function isValidPin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

async function randomSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`
  );
}

export async function setAppPin(pin: string): Promise<void> {
  if (!isValidPin(pin)) throw new Error('PIN must be 6 digits');
  const salt = await randomSalt();
  const hash = await hashPin(pin, salt);
  await Promise.all([
    SecureStore.setItemAsync(PIN_SALT_KEY, salt),
    SecureStore.setItemAsync(PIN_HASH_KEY, hash),
  ]);
}

export async function verifyAppPin(pin: string): Promise<boolean> {
  const [salt, hash] = await Promise.all([
    SecureStore.getItemAsync(PIN_SALT_KEY),
    SecureStore.getItemAsync(PIN_HASH_KEY),
  ]);
  if (!salt || !hash || !isValidPin(pin)) return false;
  return (await hashPin(pin, salt)) === hash;
}

export async function hasAppPin(): Promise<boolean> {
  return (await SecureStore.getItemAsync(PIN_HASH_KEY)) != null;
}

export async function clearAppAccess(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(PIN_HASH_KEY),
    SecureStore.deleteItemAsync(PIN_SALT_KEY),
    SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY),
  ]);
}

export async function getBiometricStatus(): Promise<BiometricStatus> {
  const [available, enrolled, types, enabled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
    SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY),
  ]);

  const label = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ? 'Face ID'
    : types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
      ? 'Touch ID'
      : 'Biometrics';

  return {
    available,
    enrolled,
    enabled: enabled === 'true',
    label,
  };
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  if (enabled) {
    const status = await getBiometricStatus();
    if (!status.available || !status.enrolled) {
      throw new Error('Biometric authentication is not available on this device');
    }
  }
  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
}

export async function authenticateWithBiometrics(reason: string): Promise<boolean> {
  const status = await getBiometricStatus();
  if (!status.enabled || !status.available || !status.enrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    fallbackLabel: 'Use PIN',
    cancelLabel: 'Cancel',
    disableDeviceFallback: true,
  });

  return result.success;
}

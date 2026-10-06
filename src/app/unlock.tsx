import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Fingerprint, LockKeyholeIcon } from 'lucide-react-native';
import { Screen, Text, Button, BrandMark, PinKeypad } from '@/components';
import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';
import { useWalletActions } from '@/wdk/hooks/useWalletActions';
import { verifyAppPassword } from '@/wdk/passwordVault';
import { usePasswordSession } from '@/state/passwordSession';
import { useSecuritySession } from '@/state/securitySession';
import { authenticateWithBiometrics, getBiometricStatus } from '@/security/appAccess';

/**
 * Unlock — matches the prototype's `unlock` screen: centered hero (logo,
 * lock-circle icon, title, body), a password field, and a bottom-pinned
 * "Unlock wallet" button.
 */
export default function Unlock() {
  const router = useRouter();
  const theme = useTheme();
  const { moderateScale } = useResponsive();
  const { unlock } = useWalletActions();
  const setSessionPassword = usePasswordSession((s) => s.setPassword);
  const setSessionPin = useSecuritySession((s) => s.setPin);
  const [pin, setPin] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('Biometrics');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    getBiometricStatus().then((status) => {
      setBiometricEnabled(status.enabled && status.available && status.enrolled);
      setBiometricLabel(status.label);
    });
  }, []);

  const completeUnlock = async (credential: string | null) => {
    await unlock();
    if (credential) {
      setSessionPassword(credential);
      setSessionPin(credential);
    }
    router.replace('/(app)/(tabs)/wallet');
  };

  const doUnlock = async () => {
    setError(null);
    if (pin.length !== 6) {
      setError('Enter your 6-digit PIN');
      return;
    }
    setBusy(true);
    try {
      const valid = await verifyAppPassword(pin);
      if (!valid) {
        setError('Incorrect PIN');
        return;
      }
      await completeUnlock(pin);
    } catch (e: any) {
      setError(e?.message ?? 'Unlock failed');
    } finally {
      setBusy(false);
    }
  };

  const doBiometricUnlock = async () => {
    setError(null);
    setBusy(true);
    try {
      const ok = await authenticateWithBiometrics(`Unlock TetherVault with ${biometricLabel}`);
      if (!ok) {
        setError(`${biometricLabel} was not verified. Use your PIN instead.`);
        return;
      }
      await completeUnlock(null);
    } catch (e: any) {
      setError(e?.message ?? 'Biometric unlock failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll>
      <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 24 }}>
        <BrandMark compact />
        <View
          style={{
            width: moderateScale(72),
            height: moderateScale(72),
            borderRadius: moderateScale(36),
            backgroundColor: theme.colors.brandTint,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 24,
            marginBottom: 20,
          }}
        >
          <LockKeyholeIcon size={moderateScale(34)} color={theme.colors.brand} />
        </View>
        <Text variant="h1" center>Welcome back</Text>
        <Text variant="body" color="textSecondary" center style={{ marginTop: 4 }}>
          Enter your PIN to unlock your wallet.
        </Text>
      </View>

      <PinKeypad value={pin} onChange={setPin} />

      {error ? <Text variant="small" color="error" style={{ marginTop: 8 }}>{error}</Text> : null}

      <View style={{ marginTop: 'auto' }}>
        {biometricEnabled ? (
          <Button
            label={`Unlock with ${biometricLabel}`}
            variant="tinted"
            onPress={doBiometricUnlock}
            disabled={busy}
            icon={<Fingerprint size={moderateScale(16)} color={theme.colors.textPrimary} />}
          />
        ) : null}
        <Button label="Unlock wallet" onPress={doUnlock} loading={busy} disabled={!pin} />
      </View>
    </Screen>
  );
}

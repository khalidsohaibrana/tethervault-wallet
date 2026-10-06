import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen, ScreenHeader, Text, Button, PinKeypad, Toggle, Card } from '@/components';
import { useWalletActions } from '@/wdk/hooks/useWalletActions';
import { setAppPassword } from '@/wdk/passwordVault';
import { usePasswordSession } from '@/state/passwordSession';
import { useSecuritySession } from '@/state/securitySession';
import { getBiometricStatus, setBiometricEnabled } from '@/security/appAccess';

/**
 * PIN step + wallet commit + app access setup.
 *
 * WDK owns wallet key storage. TetherVault adds a local 6-digit PIN gate and
 * optional biometric convenience unlock before calling WDK unlock/reveal/send.
 */
export default function Password() {
  const router = useRouter();
  const { mode = 'create', mnemonic = '' } = useLocalSearchParams<{ mode?: 'create' | 'import'; mnemonic?: string }>();
  const { importWallet } = useWalletActions();
  const setSessionPassword = usePasswordSession((s) => s.setPassword);
  const setSessionPin = useSecuritySession((s) => s.setPin);
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [biometricLabel, setBiometricLabel] = useState('Biometrics');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const step = mode === 'create' ? 'Step 3 of 4' : 'Step 2 of 3';

  React.useEffect(() => {
    getBiometricStatus().then((status) => {
      setBiometricLabel(status.label);
      setBiometricAvailable(status.available && status.enrolled);
      setEnableBiometric(status.available && status.enrolled);
    });
  }, []);

  const onContinue = async () => {
    setError(null);
    if (pin.length !== 6) {
      setError('Enter a 6-digit PIN');
      return;
    }
    if (pin !== confirm) {
      setError('PINs do not match');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'create') {
        // Commit the previewed phrase now (persist + unlock via WDK).
        await importWallet(mnemonic);
      }
      // Establish local access control. setAppPassword remains the storage
      // compatibility layer for cloud backup, but the credential is now a PIN.
      await setAppPassword(pin);
      await setBiometricEnabled(enableBiometric && biometricAvailable);
      setSessionPassword(pin);
      setSessionPin(pin);
      router.push('/(onboarding)/cloud-backup');
    } catch (e: any) {
      setError(e?.message ?? 'Could not create wallet');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll>
      <ScreenHeader backStyle="plain" step={step} onBack={() => router.back()} />
      <Text variant="h1">Create your PIN</Text>
      <Text variant="body" color="textSecondary">
        Use a 6-digit PIN to unlock TetherVault and approve sensitive wallet actions.
      </Text>

      <Text variant="label" style={{ marginTop: 20 }}>PIN</Text>
      <PinKeypad value={pin} onChange={setPin} />

      <Text variant="label" style={{ marginTop: 22 }}>Confirm PIN</Text>
      <PinKeypad value={confirm} onChange={setConfirm} />

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18 }}>
        <View style={{ flex: 1 }}>
          <Text variant="tokenName">Unlock with {biometricLabel}</Text>
          <Text variant="small" color="textSecondary">
            {biometricAvailable
              ? `${biometricLabel} is a convenience unlock. Your PIN remains the fallback.`
              : 'Biometric unlock is unavailable or not enrolled on this simulator/device.'}
          </Text>
        </View>
        <Toggle
          value={enableBiometric && biometricAvailable}
          onValueChange={setEnableBiometric}
        />
      </Card>

      {error ? <Text variant="small" color="error" style={{ marginTop: 8 }}>{error}</Text> : null}

      <View style={{ marginTop: 'auto' }}>
        <Button
          label="Continue"
          onPress={onContinue}
          loading={busy}
          disabled={!pin}
        />
      </View>
    </Screen>
  );
}

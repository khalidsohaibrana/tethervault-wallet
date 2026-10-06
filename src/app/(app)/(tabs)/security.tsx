import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Fingerprint, KeyRound, Lock, ShieldCheck, TriangleAlert } from 'lucide-react-native';
import { Screen, Text, Card, ListItem, Toggle, Button, PinKeypad } from '@/components';
import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';
import {
  authenticateWithBiometrics,
  getBiometricStatus,
  setBiometricEnabled,
  verifyAppPin,
  type BiometricStatus,
} from '@/security/appAccess';
import { useWalletActions } from '@/wdk/hooks/useWalletActions';

export default function SecurityScreen() {
  const theme = useTheme();
  const { moderateScale } = useResponsive();
  const { getMnemonic } = useWalletActions();
  const [biometrics, setBiometrics] = useState<BiometricStatus | null>(null);
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refreshBiometrics = () => getBiometricStatus().then(setBiometrics);

  useEffect(() => {
    refreshBiometrics();
  }, []);

  const toggleBiometrics = async (enabled: boolean) => {
    setBusy(true);
    try {
      await setBiometricEnabled(enabled);
      await refreshBiometrics();
    } catch (e: any) {
      setPinError(e?.message ?? 'Could not update biometric unlock');
    } finally {
      setBusy(false);
    }
  };

  const revealPhrase = async () => {
    setMnemonic(null);
    setPinError(null);

    if (biometrics?.enabled) {
      const ok = await authenticateWithBiometrics(`Reveal recovery phrase with ${biometrics.label}`);
      if (ok) {
        setMnemonic(await getMnemonic());
        return;
      }
    }

    setPinPromptOpen(true);
  };

  const verifyAndReveal = async () => {
    setPinError(null);
    if (pinAttempt.length !== 6) {
      setPinError('Enter your 6-digit PIN');
      return;
    }
    setBusy(true);
    try {
      const valid = await verifyAppPin(pinAttempt);
      if (!valid) {
        setPinError('Incorrect PIN');
        return;
      }
      setMnemonic(await getMnemonic());
      setPinPromptOpen(false);
      setPinAttempt('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll edges={['top']}>
      <View style={{ paddingTop: theme.layout.screenPaddingTop }}>
        <Text variant="h1">Security</Text>
        <Text variant="body" color="textSecondary" style={{ marginTop: 4 }}>
          Local controls for app access, biometric unlock, and recovery phrase protection.
        </Text>

        <Card style={{ marginTop: 18 }}>
          <ListItem
            leading={<ShieldCheck size={moderateScale(22)} color={theme.colors.brand} />}
            trailing={<Text variant="small" color="success">Enabled</Text>}
          >
            <Text variant="tokenName">Self-custody</Text>
            <Text variant="small" color="textSecondary">Keys stay on this device through WDK secure storage.</Text>
          </ListItem>
          <ListItem
            leading={<Lock size={moderateScale(22)} color={theme.colors.brand} />}
            trailing={<Text variant="small" color="success">6 digits</Text>}
          >
            <Text variant="tokenName">PIN lock</Text>
            <Text variant="small" color="textSecondary">Required to unlock TetherVault and approve risky actions.</Text>
          </ListItem>
          <ListItem
            leading={<Fingerprint size={moderateScale(22)} color={theme.colors.brand} />}
            trailing={
              <Toggle
                value={!!biometrics?.enabled}
                onValueChange={toggleBiometrics}
              />
            }
            divider={false}
          >
            <Text variant="tokenName">{biometrics?.label ?? 'Biometrics'}</Text>
            <Text variant="small" color="textSecondary">
              {biometrics?.available && biometrics.enrolled
                ? 'Convenience unlock. PIN remains the fallback.'
                : 'Not available or not enrolled on this device.'}
            </Text>
          </ListItem>
        </Card>

        <Card style={{ marginTop: 14, backgroundColor: theme.colors.brandTint }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <TriangleAlert size={moderateScale(18)} color={theme.colors.brand} />
            <Text variant="small" color="textSecondary" style={{ flex: 1 }}>
              TetherVault cannot recover your wallet if you lose both this device access and your recovery phrase.
            </Text>
          </View>
        </Card>

        <Button
          label="Reveal Recovery Phrase"
          variant="secondary"
          onPress={revealPhrase}
          icon={<KeyRound size={moderateScale(16)} color={theme.colors.brand} />}
        />

        {pinPromptOpen ? (
          <Card style={{ marginTop: 14 }}>
            <Text variant="tokenName">Confirm PIN</Text>
            <Text variant="small" color="textSecondary">Required before showing your recovery phrase.</Text>
            <PinKeypad value={pinAttempt} onChange={setPinAttempt} />
            <Button label="Reveal phrase" onPress={verifyAndReveal} loading={busy} disabled={!pinAttempt} />
          </Card>
        ) : null}

        {pinError ? <Text variant="small" color="error" style={{ marginTop: 10 }}>{pinError}</Text> : null}

        {mnemonic ? (
          <Card style={{ marginTop: 14 }}>
            <Text variant="tokenName">Recovery phrase</Text>
            <Text variant="small" color="textSecondary" style={{ marginTop: 4 }}>
              Write this down offline. Do not share it with anyone.
            </Text>
            <Text variant="mono" mono style={{ marginTop: 12, lineHeight: 24 }}>
              {mnemonic}
            </Text>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

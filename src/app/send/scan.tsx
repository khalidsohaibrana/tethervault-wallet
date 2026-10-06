import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Flashlight, QrCode, X } from 'lucide-react-native';
import { Button, Card, Screen, ScreenHeader, Text } from '@/components';
import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';
import { ASSETS } from '@/wdk/assets';
import { networkDisplayName } from '@/wdk/chains';
import { useToast } from '@/state/toast';

function parseScannedAddress(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    const address = url.searchParams.get('address') ?? url.searchParams.get('to');
    if (address?.trim()) return address.trim();
  } catch {
    // Not a URL, continue with wallet URI parsing.
  }

  const withoutPrefix = value
    .replace(/^ethereum:/i, '')
    .replace(/^bitcoin:/i, '')
    .replace(/^web\+ethereum:/i, '');

  const candidate = withoutPrefix.split(/[?&]/)[0].split('@')[0].trim();
  if (candidate) return candidate;
  return value;
}

export default function SendScan() {
  const router = useRouter();
  const theme = useTheme();
  const { moderateScale } = useResponsive();
  const { tokenId } = useLocalSearchParams<{ tokenId: string }>();
  const asset = ASSETS.find((a) => a.getId() === tokenId);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  const subtitle = useMemo(() => {
    if (!asset) return 'Scan a wallet address QR code.';
    return `Scan a ${networkDisplayName(asset.getNetwork())} address for ${asset.getSymbol()}.`;
  }, [asset]);

  const onScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned || !asset) return;
    const address = parseScannedAddress(data);
    if (!address) {
      useToast.getState().show('No address found in QR code');
      return;
    }
    setScanned(true);
    router.replace({
      pathname: '/send/amount',
      params: { tokenId: asset.getId(), recipient: address },
    });
  };

  if (!asset) {
    return (
      <Screen>
        <ScreenHeader title="Scan QR" onBack={() => router.back()} />
        <Text variant="body" color="error">Unknown asset.</Text>
      </Screen>
    );
  }

  if (!permission) {
    return <Screen><ScreenHeader title="Scan QR" onBack={() => router.back()} /></Screen>;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <ScreenHeader title="Scan QR" onBack={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Card style={{ alignItems: 'center' }}>
            <QrCode size={moderateScale(40)} color={theme.colors.brand} />
            <Text variant="h2" center style={{ marginTop: 14 }}>Camera access</Text>
            <Text variant="body" color="textSecondary" center style={{ marginTop: 8 }}>
              Allow camera access to scan wallet address QR codes.
            </Text>
            <Button label="Allow Camera" onPress={requestPermission} />
            {permission.canAskAgain ? null : (
              <Button label="Open Settings" variant="secondary" onPress={() => Linking.openSettings()} />
            )}
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : onScanned}
      />

      <View style={[StyleSheet.absoluteFill, { padding: theme.layout.screenPaddingH, paddingTop: theme.layout.screenPaddingTop + 6 }]}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.overlayIconButton}
          >
            <ChevronLeft size={moderateScale(22)} color="#FFFFFF" />
          </Pressable>
          <Text variant="body" color="white" style={{ fontWeight: '700' }}>Scan QR</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={torch ? 'Turn torch off' : 'Turn torch on'}
            onPress={() => setTorch((v) => !v)}
            style={styles.overlayIconButton}
          >
            <Flashlight size={moderateScale(18)} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: moderateScale(246),
              height: moderateScale(246),
              borderWidth: 2,
              borderColor: '#FFFFFF',
              borderRadius: theme.radii.md,
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          />
          <Text variant="body" color="white" center style={{ marginTop: 18, paddingHorizontal: 22 }}>
            {subtitle}
          </Text>
        </View>

        <Button
          label="Enter Address Manually"
          variant="tinted"
          onPress={() => router.back()}
          icon={<X size={moderateScale(16)} color={theme.colors.textPrimary} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayIconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});

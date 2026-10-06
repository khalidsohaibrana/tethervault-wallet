import React, { useMemo } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Copy, ExternalLink, ShieldCheck, TriangleAlert } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { AssetIcon, Button, Card, LoadingState, Screen, ScreenHeader, Text } from '@/components';
import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';
import { ASSETS } from '@/wdk/assets';
import { explorerFor, isTestnetNetwork, networkDisplayName, networkModeLabel } from '@/wdk/chains';
import { useWdkAddressForNetwork, useWdkBalances, useWdkTransactions } from '@/wdk/hooks/useWalletData';
import { useToast } from '@/state/toast';

function short(value: string): string {
  if (!value || value.length < 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function timeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AssetDetail() {
  const router = useRouter();
  const theme = useTheme();
  const { moderateScale } = useResponsive();
  const { id } = useLocalSearchParams<{ id: string }>();
  const asset = ASSETS.find((a) => a.getId() === id);
  const balances = useWdkBalances();
  const tx = useWdkTransactions();
  const address = useWdkAddressForNetwork(asset?.getNetwork() ?? 'bitcoin');

  const row = balances.data.find((b) => b.token.id === asset?.getId());
  const assetTx = useMemo(
    () => tx.data.filter((t) => t.token.id === asset?.getId()).slice(0, 4),
    [asset?.getId(), tx.data],
  );

  if (!asset) {
    return (
      <Screen>
        <ScreenHeader title="Asset" onBack={() => router.back()} />
        <Text variant="body" color="error">Unknown asset.</Text>
      </Screen>
    );
  }

  if (balances.isLoading) return <LoadingState message="Loading asset" />;

  const networkName = networkDisplayName(asset.getNetwork());
  const explorer = explorerFor(asset.getNetwork());
  const isTestnet = isTestnetNetwork(asset.getNetwork());
  const contract = asset.getContractAddress();

  const copyAddress = async () => {
    if (!address.address) return;
    await Clipboard.setStringAsync(address.address);
    useToast.getState().show('Address copied');
  };

  const copyContract = async () => {
    if (!contract) return;
    await Clipboard.setStringAsync(contract);
    useToast.getState().show('Contract copied');
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <ScreenHeader title={asset.getSymbol()} onBack={() => router.back()} />

      <View style={{ alignItems: 'center', paddingVertical: moderateScale(18) }}>
        <AssetIcon
          symbol={asset.getSymbol()}
          network={asset.getNetwork()}
          size={moderateScale(62)}
          showChainBadge={asset.getSymbol().startsWith('USDT')}
        />
        <Text variant="balance" style={{ marginTop: 12 }}>
          {row?.amount ?? '0'} {asset.getSymbol()}
        </Text>
        <Text variant="body" color="textSecondary" style={{ marginTop: 4 }}>{row?.fiatValue ?? '—'}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <Button
            label="Send"
            onPress={() => router.push({ pathname: '/send/amount', params: { tokenId: asset.getId() } })}
            icon={<ArrowUpRight size={moderateScale(16)} color={theme.colors.white} />}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label="Receive"
            variant="secondary"
            onPress={() => router.push({ pathname: '/receive', params: { tokenId: asset.getId() } })}
            icon={<ArrowDownLeft size={moderateScale(16)} color={theme.colors.brand} />}
          />
        </View>
      </View>

      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          {isTestnet ? (
            <ShieldCheck size={moderateScale(19)} color={theme.colors.success} />
          ) : (
            <TriangleAlert size={moderateScale(19)} color={theme.colors.error} />
          )}
          <View style={{ flex: 1 }}>
            <Text variant="tokenName">{networkModeLabel(asset.getNetwork())} network</Text>
            <Text variant="small" color="textSecondary" style={{ marginTop: 4 }}>
              {isTestnet
                ? `${networkName} is safe for demo transfers with faucet funds.`
                : `${networkName} uses production infrastructure. Only test with tiny real balances or reconfigure this network first.`}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={{ paddingVertical: 4 }}>
        <InfoRow label="Network" value={networkName} />
        <InfoRow label="Receive address" value={address.isLoading ? 'Loading...' : short(address.address)} mono onPress={copyAddress} icon="copy" />
        {contract ? <InfoRow label="Contract" value={short(contract)} mono onPress={copyContract} icon="copy" /> : null}
        <InfoRow label="Decimals" value={String(asset.getDecimals())} />
        {explorer ? (
          <InfoRow
            label="Explorer"
            value={explorer.name}
            onPress={() => contract && Linking.openURL(explorer.url(contract))}
            icon="external"
          />
        ) : null}
      </Card>

      <Text variant="label" style={{ marginTop: 18, marginBottom: 6 }}>Recent activity</Text>
      {tx.isLoading ? (
        <Card><Text variant="body" color="textSecondary">Loading transactions…</Text></Card>
      ) : assetTx.length === 0 ? (
        <Card><Text variant="body" color="textSecondary">No transactions yet for this asset.</Text></Card>
      ) : (
        assetTx.map((item) => (
          <Pressable key={item.id} onPress={() => router.push(`/tx/${item.id}`)}>
            <Card style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ fontWeight: '600' }}>
                  {item.direction === 'out' ? 'Sent' : 'Received'} {item.token.symbol}
                </Text>
                <Text variant="small" color="textSecondary">{timeAgo(item.timestamp)} · {short(item.address)}</Text>
              </View>
              <Text variant="body" color={item.direction === 'in' ? 'success' : 'textPrimary'}>
                {item.direction === 'in' ? '+' : '-'}{item.amount}
              </Text>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

function InfoRow({
  label,
  value,
  mono,
  onPress,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onPress?: () => void;
  icon?: 'copy' | 'external';
}) {
  const theme = useTheme();
  const { moderateScale } = useResponsive();
  const content = (
    <>
      <Text variant="small" color="textSecondary">{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: '62%' }}>
        <Text variant={mono ? 'mono' : 'small'} mono={mono} numberOfLines={1} style={{ textAlign: 'right' }}>
          {value}
        </Text>
        {icon === 'copy' ? <Copy size={moderateScale(14)} color={theme.colors.brand} /> : null}
        {icon === 'external' ? <ExternalLink size={moderateScale(14)} color={theme.colors.brand} /> : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: moderateScale(11), gap: 12 }}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: moderateScale(11), gap: 12 }}>
      {content}
    </View>
  );
}

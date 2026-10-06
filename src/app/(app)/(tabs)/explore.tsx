import React from 'react';
import { Linking, Pressable, View } from 'react-native';
import {
  ArrowLeftRight,
  Banknote,
  BookUser,
  GitBranch,
  ChevronRight,
  FlaskConical,
  Landmark,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import { Card, Screen, Text } from '@/components';
import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';
import { useToast } from '@/state/toast';

type ServiceStatus = 'live' | 'planned' | 'external';

const SERVICES: {
  title: string;
  subtitle: string;
  status: ServiceStatus;
  icon: typeof ArrowLeftRight;
  action: () => void;
}[] = [
  {
    title: 'Swap',
    subtitle: 'Cross-chain stablecoin swaps via provider integration.',
    status: 'planned',
    icon: ArrowLeftRight,
    action: () => useToast.getState().show('Swap provider integration planned'),
  },
  {
    title: 'Buy USDT',
    subtitle: 'Fiat on-ramp entry point for MoonPay, Transak, or Ramp.',
    status: 'planned',
    icon: Banknote,
    action: () => useToast.getState().show('On-ramp integration planned'),
  },
  {
    title: 'Bridge',
    subtitle: 'Move USDT between Ethereum, Polygon, and Arbitrum.',
    status: 'planned',
    icon: GitBranch,
    action: () => useToast.getState().show('Bridge integration planned'),
  },
  {
    title: 'Earn',
    subtitle: 'Stablecoin yield opportunities with risk disclosure.',
    status: 'planned',
    icon: Landmark,
    action: () => useToast.getState().show('Earn strategies planned'),
  },
  {
    title: 'Address book',
    subtitle: 'Save trusted recipients and reduce paste mistakes.',
    status: 'planned',
    icon: BookUser,
    action: () => useToast.getState().show('Address book planned'),
  },
  {
    title: 'Testnet tools',
    subtitle: 'Open Sepolia faucet resources for safe demo funding.',
    status: 'external',
    icon: FlaskConical,
    action: () => Linking.openURL('https://sepoliafaucet.com/'),
  },
];

export default function Explore() {
  const theme = useTheme();
  const { moderateScale } = useResponsive();

  return (
    <Screen scroll edges={['top']}>
      <View style={{ marginBottom: 18 }}>
        <Text variant="h1">Explore</Text>
        <Text variant="body" color="textSecondary" style={{ marginTop: 6 }}>
          Services, integrations, and testnet tools for TetherVault.
        </Text>
      </View>

      <Card style={{ marginBottom: 14, backgroundColor: theme.colors.brandTint }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <ShieldCheck size={moderateScale(22)} color={theme.colors.brand} />
          <View style={{ flex: 1 }}>
            <Text variant="tokenName">Self-custody first</Text>
            <Text variant="small" color="textSecondary" style={{ marginTop: 4 }}>
              TetherVault can surface third-party services here, but signing and recovery remain protected by the wallet.
            </Text>
          </View>
        </View>
      </Card>

      <Text variant="label" style={{ marginBottom: 6 }}>Featured</Text>
      {SERVICES.map((service) => (
        <ServiceRow key={service.title} {...service} />
      ))}

      <Card style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <Sparkles size={moderateScale(20)} color={theme.colors.brand} />
          <View style={{ flex: 1 }}>
            <Text variant="tokenName">Demo readiness</Text>
            <Text variant="small" color="textSecondary" style={{ marginTop: 4 }}>
              Test transactions should use Bitcoin Testnet and Ethereum Sepolia. Production networks are labeled before send.
            </Text>
          </View>
        </View>
      </Card>
    </Screen>
  );
}

function ServiceRow({
  title,
  subtitle,
  status,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle: string;
  status: ServiceStatus;
  icon: typeof ArrowLeftRight;
  action: () => void;
}) {
  const theme = useTheme();
  const { moderateScale } = useResponsive();
  const statusLabel = status === 'external' ? 'Open' : status === 'live' ? 'Live' : 'Planned';

  return (
    <Pressable onPress={action}>
      <Card style={{ marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: moderateScale(42),
            height: moderateScale(42),
            borderRadius: theme.radii.md,
            backgroundColor: theme.colors.brandTint,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={moderateScale(20)} color={theme.colors.brand} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text variant="tokenName">{title}</Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: theme.radii.lg,
                backgroundColor: status === 'planned' ? theme.colors.bgPrimary : theme.colors.brandTint,
              }}
            >
              <Text variant="small" color={status === 'planned' ? 'textSecondary' : 'brand'}>{statusLabel}</Text>
            </View>
          </View>
          <Text variant="small" color="textSecondary" style={{ marginTop: 3 }}>{subtitle}</Text>
        </View>
        <ChevronRight size={moderateScale(18)} color={theme.colors.textSecondary} />
      </Card>
    </Pressable>
  );
}

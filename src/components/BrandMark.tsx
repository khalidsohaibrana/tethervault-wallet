import React from 'react';
import { View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Text } from './Text';
import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact }: BrandMarkProps) {
  const theme = useTheme();
  const { moderateScale } = useResponsive();
  const iconSize = compact ? moderateScale(28) : moderateScale(38);
  const badgeSize = compact ? moderateScale(52) : moderateScale(68);

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
          backgroundColor: theme.colors.brandTint,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: compact ? moderateScale(12) : moderateScale(16),
        }}
      >
        <ShieldCheck size={iconSize} color={theme.colors.brand} strokeWidth={2.2} />
      </View>
      <Text
        variant={compact ? 'h2' : 'h1'}
        center
        style={{ fontWeight: '700' }}
      >
        TetherVault
      </Text>
      <Text
        variant="small"
        color="textSecondary"
        center
        style={{ marginTop: moderateScale(4), fontWeight: '600' }}
      >
        USDt wallet demo
      </Text>
    </View>
  );
}

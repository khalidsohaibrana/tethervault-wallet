import React from 'react';
import { Pressable, View } from 'react-native';
import { Delete } from 'lucide-react-native';
import { Text } from './Text';
import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';

interface PinKeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

export function PinKeypad({ value, onChange, maxLength = 6 }: PinKeypadProps) {
  const theme = useTheme();
  const { moderateScale } = useResponsive();

  const pressKey = (key: string) => {
    if (!key) return;
    if (key === 'delete') {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length < maxLength) onChange(`${value}${key}`);
  };

  return (
    <View style={{ gap: moderateScale(12), marginTop: moderateScale(18) }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: moderateScale(10) }}>
        {Array.from({ length: maxLength }).map((_, index) => (
          <View
            key={index}
            style={{
              width: moderateScale(12),
              height: moderateScale(12),
              borderRadius: moderateScale(6),
              backgroundColor: index < value.length ? theme.colors.brand : theme.colors.border,
            }}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: moderateScale(10) }}>
        {KEYS.map((key, index) => (
          <Pressable
            key={`${key}-${index}`}
            disabled={!key}
            onPress={() => pressKey(key)}
            style={({ pressed }) => ({
              width: moderateScale(82),
              height: moderateScale(58),
              borderRadius: theme.radii.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: !key
                ? 'transparent'
                : pressed
                  ? theme.colors.brandTintPressed
                  : theme.colors.bgSecondary,
              borderWidth: key ? 1 : 0,
              borderColor: theme.colors.border,
            })}
          >
            {key === 'delete' ? (
              <Delete size={moderateScale(21)} color={theme.colors.textPrimary} />
            ) : (
              <Text variant="h2">{key}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

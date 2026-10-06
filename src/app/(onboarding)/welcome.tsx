import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Button, BrandMark } from '@/components';

export default function Welcome() {
  const router = useRouter();

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 56 }}>
        <BrandMark />
        <Text
          variant="body"
          color="textSecondary"
          center
          style={{ maxWidth: '85%', marginTop: 28 }}
        >
          Create, secure, receive, and send USDt with a self-custodial wallet powered by Tether WDK.
        </Text>
      </View>

      <Button
        label="Create new wallet"
        onPress={() => router.push('/(onboarding)/seed-hidden')}
      />
      <Button
        label="Import existing wallet"
        variant="secondary"
        onPress={() => router.push('/(onboarding)/import')}
      />
    </Screen>
  );
}

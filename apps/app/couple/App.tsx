import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { AppLayout } from '@we/ui';
import { createTabs } from './config/tabs';
import { theme } from './config/theme';
import { SettingsScreen } from './screens/SettingsScreen';

const logo = (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Image source={require('./assets/icon.png')} style={{ width: 28, height: 28 }} />
    <Text style={{ fontWeight: '700', fontSize: 16 }}>우리, 커플</Text>
  </View>
);

export default function App() {
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <AppLayout
      logo={logo}
      tabs={createTabs(() => setShowSettings(true))}
      theme={theme}
    />
  );
}

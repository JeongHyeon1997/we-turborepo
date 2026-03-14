import './global.css';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { AppLayout } from '@we/ui';
import { createTabs } from './config/tabs';
import { theme } from './config/theme';
import { SettingsScreen } from './screens/SettingsScreen';

const logo = (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Image
      source={require('../../../packages/assets/couple_logo.png')}
      style={{ width: 28, height: 28 }}
    />
    <Text style={{ fontFamily: 'BMJUA', fontWeight: '700', fontSize: 16 }}>우리, 커플</Text>
  </View>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    BMJUA: require('../../../packages/assets/fonts/BMJUA_ttf.ttf'),
    BMHANNAPro: require('../../../packages/assets/fonts/BMHANNAPro.ttf'),
  });

  const [showSettings, setShowSettings] = useState(false);

  if (!fontsLoaded) return null;

  return (
    <AppLayout
      logo={logo}
      tabs={createTabs(() => setShowSettings(true))}
      theme={theme}
      stackScreen={
        showSettings
          ? { content: <SettingsScreen />, title: '설정', onBack: () => setShowSettings(false) }
          : undefined
      }
    />
  );
}

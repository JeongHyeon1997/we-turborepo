import { Image, Text, View } from 'react-native';
import { AppLayout } from '@we/ui';
import { tabs } from './config/tabs';
import { theme } from './config/theme';

const logo = (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Image source={require('./assets/icon.png')} style={{ width: 28, height: 28 }} />
    <Text style={{ fontWeight: '700', fontSize: 16 }}>우리, 커플</Text>
  </View>
);

export default function App() {
  return <AppLayout logo={logo} tabs={tabs} theme={theme} />;
}

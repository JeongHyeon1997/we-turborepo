import { Text } from 'react-native';
import type { NavTab } from '@we/ui';
import { MyPetScreen } from '../screens/MyPetScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyInfoScreen } from '../screens/MyInfoScreen';

export const tabs: NavTab[] = [
  { key: 'my-pet',    label: '내새끼',  icon: <Text>🐾</Text>, screen: <MyPetScreen /> },
  { key: 'community', label: '커뮤니티', icon: <Text>💬</Text>, screen: <CommunityScreen /> },
  { key: 'my-info',   label: '내 정보', icon: <Text>👤</Text>, screen: <MyInfoScreen /> },
];

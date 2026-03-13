import { Text } from 'react-native';
import type { NavTab } from '@we/ui';
import { DiaryScreen } from '../screens/DiaryScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyInfoScreen } from '../screens/MyInfoScreen';

export const tabs: NavTab[] = [
  { key: 'diary',     label: '일기장',  icon: <Text>📔</Text>, screen: <DiaryScreen /> },
  { key: 'community', label: '커뮤니티', icon: <Text>💬</Text>, screen: <CommunityScreen /> },
  { key: 'my-info',   label: '내 정보', icon: <Text>👤</Text>, screen: <MyInfoScreen /> },
];

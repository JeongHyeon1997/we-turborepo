import { Ionicons } from '@expo/vector-icons';
import type { NavTab } from '@we/ui';
import { DiaryScreen } from '../screens/DiaryScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyInfoScreen } from '../screens/MyInfoScreen';

export const tabs: NavTab[] = [
  { key: 'diary',     label: '일기장',  icon: <Ionicons name="book-outline"        size={22} />, screen: <DiaryScreen /> },
  { key: 'community', label: '커뮤니티', icon: <Ionicons name="chatbubbles-outline" size={22} />, screen: <CommunityScreen /> },
  { key: 'my-info',   label: '내 정보', icon: <Ionicons name="person-outline"      size={22} />, screen: <MyInfoScreen /> },
];

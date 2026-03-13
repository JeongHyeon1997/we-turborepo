import { Ionicons } from '@expo/vector-icons';
import type { NavTab } from '@we/ui';
import { MyPetScreen } from '../screens/MyPetScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyInfoScreen } from '../screens/MyInfoScreen';

export const tabs: NavTab[] = [
  { key: 'my-pet',    label: '내새끼',  icon: <Ionicons name="paw-outline"         size={22} />, screen: <MyPetScreen /> },
  { key: 'community', label: '커뮤니티', icon: <Ionicons name="chatbubbles-outline" size={22} />, screen: <CommunityScreen /> },
  { key: 'my-info',   label: '내 정보', icon: <Ionicons name="person-outline"      size={22} />, screen: <MyInfoScreen /> },
];

import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NavTab } from '@we/ui';
import { petColors } from '@we/utils';
import type { CommunityPost } from '@we/utils';
import { MyPetScreen } from '../screens/MyPetScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyInfoScreen } from '../screens/MyInfoScreen';

interface TabCallbacks {
  onSettingsPress: () => void;
  onPostPress: (post: CommunityPost) => void;
  onAuthorPress: (name: string) => void;
}

export function createTabs({ onSettingsPress, onPostPress, onAuthorPress }: TabCallbacks): NavTab[] {
  return [
    {
      key: 'my-pet',
      label: '내새끼',
      icon: <Ionicons name="paw-outline" size={22} />,
      screen: <MyPetScreen />,
    },
    {
      key: 'community',
      label: '커뮤니티',
      icon: <Ionicons name="chatbubbles-outline" size={22} />,
      screen: <CommunityScreen onPostPress={onPostPress} onAuthorPress={onAuthorPress} />,
    },
    {
      key: 'my-info',
      label: '내 정보',
      icon: <Ionicons name="person-outline" size={22} />,
      screen: <MyInfoScreen />,
      headerIcons: (
        <Pressable onPress={onSettingsPress} hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color={petColors.gray700} />
        </Pressable>
      ),
    },
  ];
}

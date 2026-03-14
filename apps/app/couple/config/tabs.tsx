import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NavTab } from '@we/ui';
import { coupleColors } from '@we/utils';
import type { CommunityPost } from '@we/utils';
import { DiaryScreen } from '../screens/DiaryScreen';
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
      key: 'diary',
      label: '일기장',
      icon: <Ionicons name="book-outline" size={22} />,
      screen: <DiaryScreen />,
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
          <Ionicons name="settings-outline" size={22} color={coupleColors.gray700} />
        </Pressable>
      ),
    },
  ];
}

import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NavTab } from '@we/ui';
import { marriageColors } from '@we/utils';
import type { CommunityPostBase } from '@we/utils';

interface CouplePartner { id: string; name: string; avatarColor: string; }
interface CoupleConnection { partner: CouplePartner; datingStartDate: string; shareStartDate: string; }
import { DiaryScreen } from '../screens/DiaryScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyInfoScreen } from '../screens/MyInfoScreen';

interface TabCallbacks {
  onSettingsPress: () => void;
  onPostPress: (post: CommunityPostBase) => void;
  onAuthorPress: (name: string) => void;
  onAnnouncementPress: (id: string) => void;
  onAnnouncementsListPress: () => void;
  connection: CoupleConnection | null;
  onConnectPress: () => void;
  onUpdateConnection: (c: CoupleConnection) => void;
}

export function createTabs({
  onSettingsPress,
  onPostPress,
  onAuthorPress,
  onAnnouncementPress,
  onAnnouncementsListPress,
  connection,
  onConnectPress,
  onUpdateConnection,
}: TabCallbacks): NavTab[] {
  const announcementBtn = (
    <Pressable onPress={onAnnouncementsListPress} hitSlop={8}>
      <Ionicons name="notifications-outline" size={22} color={marriageColors.gray700} />
    </Pressable>
  );

  return [
    {
      key: 'diary',
      label: '일기장',
      icon: <Ionicons name="book-outline" size={22} />,
      screen: <DiaryScreen onAnnouncementPress={onAnnouncementPress} />,
      headerIcons: announcementBtn,
    },
    {
      key: 'gallery',
      label: '갤러리',
      icon: <Ionicons name="images-outline" size={22} />,
      screen: <GalleryScreen />,
    },
    {
      key: 'community',
      label: '커뮤니티',
      icon: <Ionicons name="chatbubbles-outline" size={22} />,
      screen: (
        <CommunityScreen
          onPostPress={onPostPress}
          onAuthorPress={onAuthorPress}
          onAnnouncementPress={onAnnouncementPress}
        />
      ),
      headerIcons: announcementBtn,
    },
    {
      key: 'my-info',
      label: '내 정보',
      icon: <Ionicons name="person-outline" size={22} />,
      screen: (
        <MyInfoScreen
          onAnnouncementPress={onAnnouncementPress}
          connection={connection}
          onConnectPress={onConnectPress}
          onUpdateConnection={onUpdateConnection}
        />
      ),
      headerIcons: (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {announcementBtn}
          <Pressable onPress={onSettingsPress} hitSlop={8}>
            <Ionicons name="settings-outline" size={22} color={marriageColors.gray700} />
          </Pressable>
        </View>
      ),
    },
  ];
}

import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NavTab } from '@we/ui';
import { petColors } from '@we/utils';
import type { CommunityPostBase } from '@we/utils';

interface FamilyMember { id: string; name: string; avatarColor: string; }
interface FamilyGroup { members: FamilyMember[]; groupStartDate: string; }
import { MyPetScreen } from '../screens/MyPetScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { MyInfoScreen } from '../screens/MyInfoScreen';

interface TabCallbacks {
  onSettingsPress: () => void;
  onPostPress: (post: CommunityPostBase) => void;
  onAuthorPress: (name: string) => void;
  onAnnouncementPress: (id: string) => void;
  onAnnouncementsListPress: () => void;
  group: FamilyGroup | null;
  onConnectPress: () => void;
  onUpdateGroup: (g: FamilyGroup | null) => void;
}

export function createTabs({
  onSettingsPress,
  onPostPress,
  onAuthorPress,
  onAnnouncementPress,
  onAnnouncementsListPress,
  group,
  onConnectPress,
  onUpdateGroup,
}: TabCallbacks): NavTab[] {
  const announcementBtn = (
    <Pressable onPress={onAnnouncementsListPress} hitSlop={8}>
      <Ionicons name="notifications-outline" size={22} color={petColors.gray700} />
    </Pressable>
  );

  return [
    {
      key: 'my-pet',
      label: '내아이',
      icon: <Ionicons name="paw-outline" size={22} />,
      screen: <MyPetScreen onAnnouncementPress={onAnnouncementPress} />,
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
          group={group}
          onConnectPress={onConnectPress}
          onUpdateGroup={onUpdateGroup}
        />
      ),
      headerIcons: (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {announcementBtn}
          <Pressable onPress={onSettingsPress} hitSlop={8}>
            <Ionicons name="settings-outline" size={22} color={petColors.gray700} />
          </Pressable>
        </View>
      ),
    },
  ];
}

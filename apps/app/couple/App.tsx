import './global.css';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { AppLayout } from '@we/ui';
import { createTabs } from './config/tabs';
import { theme } from './config/theme';
import type { CommunityPost, Announcement } from '@we/utils';
import { SettingsScreen } from './screens/SettingsScreen';
import { CommunityDetailScreen } from './screens/CommunityDetailScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { AnnouncementsScreen } from './screens/AnnouncementsScreen';
import { AnnouncementDetailScreen } from './screens/AnnouncementDetailScreen';
import { announcements } from './data/announcements';

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
  const [communityPost, setCommunityPost] = useState<CommunityPost | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcementDetail, setAnnouncementDetail] = useState<Announcement | null>(null);

  if (!fontsLoaded) return null;

  const stackScreen = showSettings
    ? { content: <SettingsScreen />, title: '설정', onBack: () => setShowSettings(false) }
    : communityPost
    ? { content: <CommunityDetailScreen post={communityPost} />, title: '커뮤니티', onBack: () => setCommunityPost(null) }
    : profileName
    ? { content: <UserProfileScreen authorName={profileName} />, title: '프로필', onBack: () => setProfileName(null) }
    : announcementDetail
    ? { content: <AnnouncementDetailScreen announcement={announcementDetail} />, title: '공지사항', onBack: () => setAnnouncementDetail(null) }
    : showAnnouncements
    ? {
        content: (
          <AnnouncementsScreen
            onPress={(ann) => {
              setShowAnnouncements(false);
              setAnnouncementDetail(ann);
            }}
          />
        ),
        title: '공지사항',
        onBack: () => setShowAnnouncements(false),
      }
    : undefined;

  return (
    <AppLayout
      logo={logo}
      tabs={createTabs({
        onSettingsPress: () => setShowSettings(true),
        onPostPress: (post) => setCommunityPost(post),
        onAuthorPress: (name) => setProfileName(name),
        onAnnouncementPress: (id) => {
          const ann = announcements.find(a => a.id === id);
          if (ann) setAnnouncementDetail(ann);
        },
        onAnnouncementsListPress: () => setShowAnnouncements(true),
      })}
      theme={theme}
      stackScreen={stackScreen}
    />
  );
}

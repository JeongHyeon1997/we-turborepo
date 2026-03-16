import './global.css';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { AppLayout } from '@we/ui';
import { createTabs } from './config/tabs';
import { theme } from './config/theme';
import type { CommunityPost, Announcement, CoupleConnection, CouplePartner } from '@we/utils';
import { SettingsScreen } from './screens/SettingsScreen';
import { CommunityDetailScreen } from './screens/CommunityDetailScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { AnnouncementsScreen } from './screens/AnnouncementsScreen';
import { AnnouncementDetailScreen } from './screens/AnnouncementDetailScreen';
import { CoupleConnectScreen } from './screens/CoupleConnectScreen';
import { CoupleConfirmScreen } from './screens/CoupleConfirmScreen';
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
  const [connection, setConnection] = useState<CoupleConnection | null>(null);
  const [showCoupleConnect, setShowCoupleConnect] = useState(false);
  const [confirmPartner, setConfirmPartner] = useState<CouplePartner | null>(null);

  if (!fontsLoaded) return null;

  const today = new Date().toISOString().slice(0, 10);

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
    : confirmPartner
    ? {
        content: (
          <CoupleConfirmScreen
            partner={confirmPartner}
            onAccept={() => {
              setConnection({ partner: confirmPartner, datingStartDate: today, shareStartDate: today });
              setConfirmPartner(null);
              setShowCoupleConnect(false);
            }}
            onDecline={() => setConfirmPartner(null)}
          />
        ),
        title: '커플 연결',
        onBack: () => setConfirmPartner(null),
      }
    : showCoupleConnect
    ? {
        content: (
          <CoupleConnectScreen
            onCodeEntered={(partner) => setConfirmPartner(partner)}
          />
        ),
        title: '상대방 연결',
        onBack: () => setShowCoupleConnect(false),
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
        connection,
        onConnectPress: () => setShowCoupleConnect(true),
        onUpdateConnection: (c) => setConnection(c),
      })}
      theme={theme}
      stackScreen={stackScreen}
    />
  );
}

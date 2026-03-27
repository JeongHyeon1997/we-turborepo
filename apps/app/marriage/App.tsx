import './global.css';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { AppLayout, AuthFeature, AuthPromptModal } from '@we/ui';
import { createTabs } from './config/tabs';
import { theme } from './config/theme';
import type { CommunityPostBase, AnnouncementBase, AuthUser } from '@we/utils';

interface CouplePartner { id: string; name: string; avatarColor: string; }
interface CoupleConnection { partner: CouplePartner; datingStartDate: string; shareStartDate: string; }
import { SettingsScreen } from './screens/SettingsScreen';
import { CommunityDetailScreen } from './screens/CommunityDetailScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { AnnouncementsScreen } from './screens/AnnouncementsScreen';
import { AnnouncementDetailScreen } from './screens/AnnouncementDetailScreen';
import { CoupleConnectScreen } from './screens/CoupleConnectScreen';
import { CoupleConfirmScreen } from './screens/CoupleConfirmScreen';
import { announcements } from './data/announcements';
import { login, useAuth } from './data/authStore';

const logo = (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Text style={{ fontSize: 22 }}>💍</Text>
    <Text style={{ fontFamily: 'BMJUA', fontWeight: '700', fontSize: 16 }}>우리, 결혼</Text>
  </View>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    BMJUA: require('../../../packages/assets/fonts/BMJUA_ttf.ttf'),
    BMHANNAPro: require('../../../packages/assets/fonts/BMHANNAPro.ttf'),
  });

  const { isLoggedIn } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [communityPost, setCommunityPost] = useState<CommunityPostBase | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcementDetail, setAnnouncementDetail] = useState<AnnouncementBase | null>(null);
  const [connection, setConnection] = useState<CoupleConnection | null>(null);
  const [showCoupleConnect, setShowCoupleConnect] = useState(false);
  const [confirmPartner, setConfirmPartner] = useState<CouplePartner | null>(null);

  if (!fontsLoaded) return null;

  const today = new Date().toISOString().slice(0, 10);

  const stackScreen = showAuth
    ? {
        content: (
          <AuthFeature
            onLogin={(user: AuthUser) => { login(user); setShowAuth(false); }}
            accentColor="#c9a96e"
            appName="우리, 결혼"
          />
        ),
        title: '로그인',
        onBack: () => setShowAuth(false),
      }
    : showSettings
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
        title: '배우자 연결',
        onBack: () => setConfirmPartner(null),
      }
    : showCoupleConnect
    ? {
        content: (
          <CoupleConnectScreen
            onCodeEntered={(partner) => setConfirmPartner(partner)}
          />
        ),
        title: '배우자 연결',
        onBack: () => setShowCoupleConnect(false),
      }
    : undefined;

  return (
    <>
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
          onConnectPress: () => { if (!isLoggedIn) { setShowAuthPrompt(true); } else { setShowCoupleConnect(true); } },
          onUpdateConnection: (c) => setConnection(c),
        })}
        theme={theme}
        stackScreen={stackScreen}
      />
      <AuthPromptModal
        visible={showAuthPrompt}
        message="배우자 연결은 회원만 이용할 수 있어요"
        accentColor="#c9a96e"
        onLoginPress={() => { setShowAuthPrompt(false); setShowAuth(true); }}
        onClose={() => setShowAuthPrompt(false)}
      />
    </>
  );
}

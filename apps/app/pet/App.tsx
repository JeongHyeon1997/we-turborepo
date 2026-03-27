import './global.css';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { AppLayout, AuthFeature, AuthPromptModal } from '@we/ui';
import { createTabs } from './config/tabs';
import { theme } from './config/theme';
import type { CommunityPostBase, AnnouncementBase, AuthUser } from '@we/utils';

interface FamilyMember { id: string; name: string; avatarColor: string; }
interface FamilyGroup { members: FamilyMember[]; groupStartDate: string; }
import { SettingsScreen } from './screens/SettingsScreen';
import { CommunityDetailScreen } from './screens/CommunityDetailScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { AnnouncementsScreen } from './screens/AnnouncementsScreen';
import { AnnouncementDetailScreen } from './screens/AnnouncementDetailScreen';
import { FamilyConnectScreen } from './screens/FamilyConnectScreen';
import { FamilyConfirmScreen } from './screens/FamilyConfirmScreen';
import { announcements } from './data/announcements';
import { login, useAuth } from './data/authStore';

const logo = (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Image
      source={require('../../../packages/assets/pet_logo.png')}
      style={{ width: 28, height: 28 }}
    />
    <Text style={{ fontFamily: 'BMJUA', fontWeight: '700', fontSize: 16 }}>우리, 아이</Text>
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
  const [group, setGroup] = useState<FamilyGroup | null>(null);
  const [showFamilyConnect, setShowFamilyConnect] = useState(false);
  const [confirmMember, setConfirmMember] = useState<FamilyMember | null>(null);

  if (!fontsLoaded) return null;

  const today = new Date().toISOString().slice(0, 10);

  const stackScreen = showAuth
    ? {
        content: (
          <AuthFeature
            onLogin={(user: AuthUser) => { login(user); setShowAuth(false); }}
            accentColor="#97A4D9"
            appName="우리, 아이"
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
    : confirmMember
    ? {
        content: (
          <FamilyConfirmScreen
            newMember={confirmMember}
            existingGroup={group}
            onAccept={() => {
              const members = group ? [...group.members, confirmMember] : [confirmMember];
              setGroup(g => g
                ? { ...g, members }
                : { members: [confirmMember], groupStartDate: today }
              );
              setConfirmMember(null);
              setShowFamilyConnect(false);
            }}
            onDecline={() => setConfirmMember(null)}
          />
        ),
        title: '가족 추가',
        onBack: () => setConfirmMember(null),
      }
    : showFamilyConnect
    ? {
        content: (
          <FamilyConnectScreen
            onCodeEntered={(member) => setConfirmMember(member)}
          />
        ),
        title: '가족 초대',
        onBack: () => setShowFamilyConnect(false),
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
          group,
          onConnectPress: () => { if (!isLoggedIn) { setShowAuthPrompt(true); } else { setShowFamilyConnect(true); } },
          onUpdateGroup: (g) => setGroup(g),
        })}
        theme={theme}
        stackScreen={stackScreen}
      />
      <AuthPromptModal
        visible={showAuthPrompt}
        message="가족 연결은 회원만 이용할 수 있어요"
        accentColor="#97A4D9"
        onLoginPress={() => { setShowAuthPrompt(false); setShowAuth(true); }}
        onClose={() => setShowAuthPrompt(false)}
      />
    </>
  );
}

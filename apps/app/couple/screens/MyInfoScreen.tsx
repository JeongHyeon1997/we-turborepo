import { useState } from 'react';
import { View, Text, Image, Pressable, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { coupleColors } from '@we/utils';
import type { CommunityPostBase, DiaryEntry } from '@we/utils';

interface CouplePartner { id: string; name: string; avatarColor: string; }
interface CoupleConnection { partner: CouplePartner; datingStartDate: string; shareStartDate: string; }
import { AnnouncementBanner, DatePickerModal } from '@we/ui';
import { announcements } from '../data/announcements';
import { useAuth, logout } from '../data/authStore';
import { useDiaryEntries } from '../data/diaryStore';

const ACCENT = '#f4a0a0';

function daysBetween(isoDate: string) {
  const start = new Date(isoDate);
  const now   = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${y}.${m}.${d}`;
}

interface CoupleSectionProps {
  connection: CoupleConnection | null;
  onConnectPress: () => void;
  onUpdateConnection: (c: CoupleConnection) => void;
}

function CoupleSection({ connection, onConnectPress, onUpdateConnection }: CoupleSectionProps) {
  const [pickerType, setPickerType] = useState<'dating' | 'share' | null>(null);

  if (!connection) {
    return (
      <Pressable
        style={({ pressed }) => [cs.connectCard, pressed && { opacity: 0.8 }]}
        onPress={onConnectPress}
      >
        <Text style={cs.connectEmoji}>💕</Text>
        <View style={cs.connectBody}>
          <Text style={cs.connectTitle}>상대방과 연결해주세요</Text>
          <Text style={cs.connectSub}>함께 일기를 작성하려면 연결이 필요합니다.</Text>
        </View>
        <Text style={cs.connectArrow}>초대코드 입력하러 가기 →</Text>
      </Pressable>
    );
  }

  const { partner, datingStartDate, shareStartDate } = connection;

  return (
    <View style={cs.card}>
      {/* 아바타 페어 */}
      <View style={cs.avatarRow}>
        <View style={[cs.avatar, { backgroundColor: coupleColors.primary300 }]}>
          <Text style={cs.avatarText}>나</Text>
        </View>
        <Text style={cs.heart}>💕</Text>
        <View style={[cs.avatar, { backgroundColor: partner.avatarColor }]}>
          <Text style={cs.avatarText}>{partner.name[0]}</Text>
        </View>
      </View>

      <Text style={cs.partnerName}>{partner.name}님과</Text>
      <Text style={cs.daysText}>{daysBetween(datingStartDate)}일째 연애중 🥰</Text>

      {/* 연애 시작일 */}
      <Pressable
        style={({ pressed }) => [cs.dateRow, pressed && { opacity: 0.7 }]}
        onPress={() => setPickerType('dating')}
      >
        <Ionicons name="heart-outline" size={16} color={ACCENT} />
        <Text style={cs.dateLabel}>연애 시작일</Text>
        <Text style={cs.dateValue}>{formatDate(datingStartDate)}</Text>
        <Ionicons name="pencil-outline" size={14} color={coupleColors.gray400} />
      </Pressable>

      {/* 일기 공유 시작일 */}
      <Pressable
        style={({ pressed }) => [cs.dateRow, pressed && { opacity: 0.7 }]}
        onPress={() => setPickerType('share')}
      >
        <Ionicons name="book-outline" size={16} color={ACCENT} />
        <Text style={cs.dateLabel}>{partner.name}님과 일기 공유 시작일</Text>
        <Text style={cs.dateValue}>{formatDate(shareStartDate)}</Text>
        <Ionicons name="pencil-outline" size={14} color={coupleColors.gray400} />
      </Pressable>

      {/* DatePickerModals */}
      <DatePickerModal
        visible={pickerType === 'dating'}
        value={datingStartDate}
        title="연애 시작일 선택"
        accentColor={ACCENT}
        onConfirm={date => {
          onUpdateConnection({ ...connection, datingStartDate: date });
          setPickerType(null);
        }}
        onCancel={() => setPickerType(null)}
      />
      <DatePickerModal
        visible={pickerType === 'share'}
        value={shareStartDate}
        title="일기 공유 시작일 선택"
        accentColor={ACCENT}
        onConfirm={date => {
          onUpdateConnection({ ...connection, shareStartDate: date });
          setPickerType(null);
        }}
        onCancel={() => setPickerType(null)}
      />
    </View>
  );
}

type FilterType = '전체' | '일기';
type FeedItem = { kind: 'diary'; data: DiaryEntry };

function formatFeedDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}


function DiaryItem({ entry }: { entry: DiaryEntry }) {
  return (
    <View style={s.item}>
      <View style={[s.itemThumb, { backgroundColor: coupleColors.primary50, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 26 }}>{entry.mood ?? '📖'}</Text>
      </View>
      <View style={s.itemBody}>
        <Text style={s.itemTitle}>{entry.title}</Text>
        <Text style={s.itemContent} numberOfLines={1}>{entry.content}</Text>
        <Text style={s.itemMeta}>{formatFeedDate(entry.createdAt)}</Text>
      </View>
      <View style={[s.badge, { backgroundColor: coupleColors.secondary200 }]}>
        <Text style={s.badgeText}>일기</Text>
      </View>
    </View>
  );
}

interface Props {
  onAnnouncementPress: (id: string) => void;
  connection: CoupleConnection | null;
  onConnectPress: () => void;
  onUpdateConnection: (c: CoupleConnection) => void;
}

export function MyInfoScreen({ onAnnouncementPress, connection, onConnectPress, onUpdateConnection }: Props) {
  const { user, isLoggedIn } = useAuth();
  const { entries: diaryEntries } = useDiaryEntries();
  const [filter, setFilter] = useState<FilterType>('전체');

  const feed: FeedItem[] = diaryEntries.map(e => ({ kind: 'diary' as const, data: e }));
  const filters: FilterType[] = ['전체', '일기'];

  if (!isLoggedIn) {
    return (
      <View style={s.authWrap}>
        <AnnouncementBanner
          announcements={announcements}
          accentColor="#f4a0a0"
          onPress={onAnnouncementPress}
        />
        <View style={s.authPrompt}>
          <Ionicons name="lock-closed-outline" size={48} color={coupleColors.gray300} />
          <Text style={s.authTitle}>로그인이 필요해요</Text>
          <Text style={s.authSub}>내 정보를 보려면 로그인해주세요.</Text>
        </View>
      </View>
    );
  }

  const Header = (
    <View>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#f4a0a0"
        onPress={onAnnouncementPress}
      />
      <View style={s.coupleSection}>
        <CoupleSection
          connection={connection}
          onConnectPress={onConnectPress}
          onUpdateConnection={onUpdateConnection}
        />
      </View>
      <View style={s.profileSection}>
        <View style={[s.avatar, s.avatarPlaceholder]}>
          <Ionicons name="person" size={48} color={coupleColors.gray400} />
        </View>
        <Text style={s.nickname}>{user!.name}</Text>
        <Pressable style={({ pressed }) => [s.editButton, pressed && s.editButtonPressed]}>
          <Text style={s.editButtonText}>프로필 편집</Text>
        </Pressable>
        <Pressable onPress={() => logout()} style={s.logoutButton}>
          <Text style={s.logoutButtonText}>로그아웃</Text>
        </Pressable>
      </View>

      <View style={s.filterRow}>
        {filters.map(f => (
          <Pressable
            key={f}
            style={[s.filterBtn, filter === f && s.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[s.filterBtnText, filter === f && s.filterBtnTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      data={feed}
      keyExtractor={item => item.data.id}
      ListHeaderComponent={Header}
      ListEmptyComponent={<Text style={s.empty}>아직 작성한 글이 없어요.</Text>}
      renderItem={({ item }) => <DiaryItem entry={item.data as DiaryEntry} />}
    />
  );
}

const cs = StyleSheet.create({
  connectCard: {
    margin: 16, marginBottom: 0,
    padding: 16, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#f4a0a0',
    borderStyle: 'dashed',
    backgroundColor: '#fff5f5',
    alignItems: 'center', gap: 6,
  },
  connectEmoji: { fontSize: 28 },
  connectBody: { alignItems: 'center', gap: 2 },
  connectTitle: { fontSize: 15, fontFamily: 'BMJUA', color: '#f4a0a0' },
  connectSub: { fontSize: 12, fontFamily: 'BMHANNAPro', color: coupleColors.gray500, textAlign: 'center' },
  connectArrow: { fontSize: 12, fontFamily: 'BMJUA', color: '#f4a0a0', marginTop: 4 },
  card: {
    margin: 16, marginBottom: 0,
    padding: 20, borderRadius: 20,
    backgroundColor: coupleColors.white,
    borderWidth: 1, borderColor: coupleColors.primary100,
    shadowColor: '#f4a0a0', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
    alignItems: 'center', gap: 10,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 2 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontFamily: 'BMJUA', color: '#fff' },
  heart: { fontSize: 24 },
  partnerName: { fontSize: 15, fontFamily: 'BMJUA', color: coupleColors.gray700 },
  daysText: { fontSize: 20, fontFamily: 'BMJUA', color: '#f4a0a0' },
  dateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    width: '100%', paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: coupleColors.primary50, borderRadius: 12,
  },
  dateLabel: { flex: 1, fontSize: 13, fontFamily: 'BMJUA', color: coupleColors.gray700 },
  dateValue: { fontSize: 13, fontFamily: 'BMHANNAPro', color: coupleColors.gray600 },
});

const s = StyleSheet.create({
  coupleSection: {},
  profileSection: { alignItems: 'center', paddingTop: 32, paddingHorizontal: 24, paddingBottom: 24 },
  avatarWrap: { marginBottom: 14 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarPlaceholder: { backgroundColor: coupleColors.gray100, alignItems: 'center', justifyContent: 'center' },
  nickname: { fontSize: 20, fontFamily: 'BMJUA', color: coupleColors.gray900, marginBottom: 18 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  statItem: { alignItems: 'center', paddingHorizontal: 28 },
  statNumber: { fontSize: 20, fontFamily: 'BMJUA', color: coupleColors.gray900 },
  statLabel: { fontSize: 13, color: coupleColors.gray500, marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: coupleColors.gray200 },
  editButton: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: coupleColors.primary400 },
  editButtonPressed: { backgroundColor: coupleColors.primary50 },
  editButtonText: { fontSize: 14, fontFamily: 'BMJUA', color: coupleColors.gray700 },
  filterRow: {
    flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: coupleColors.gray100,
  },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: coupleColors.gray200,
  },
  filterBtnActive: { backgroundColor: coupleColors.primary400, borderColor: coupleColors.primary400 },
  filterBtnText: { fontSize: 13, fontFamily: 'BMJUA', color: coupleColors.gray500 },
  filterBtnTextActive: { color: coupleColors.gray800 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 14, borderBottomWidth: 1, borderBottomColor: coupleColors.gray100,
  },
  itemThumb: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0 },
  itemThumbImg: { width: '100%', height: '100%' },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 14, fontFamily: 'BMJUA', color: coupleColors.gray800, marginBottom: 4 },
  itemContent: { fontSize: 13, fontFamily: 'BMHANNAPro', color: coupleColors.gray600, marginBottom: 4 },
  itemMeta: { fontSize: 12, color: coupleColors.gray400 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontFamily: 'BMJUA', color: coupleColors.gray600 },
  empty: { textAlign: 'center', padding: 40, color: coupleColors.gray400, fontFamily: 'BMJUA', fontSize: 14 },
  authWrap: { flex: 1 },
  authPrompt: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48, gap: 12 },
  authTitle: { fontSize: 20, fontFamily: 'BMJUA', color: coupleColors.gray800 },
  authSub: { fontSize: 14, fontFamily: 'BMHANNAPro', color: coupleColors.gray500, textAlign: 'center' },
  logoutButton: { marginTop: 8, paddingVertical: 4, paddingHorizontal: 12 },
  logoutButtonText: { fontSize: 12, fontFamily: 'BMJUA', color: coupleColors.gray400 },
});

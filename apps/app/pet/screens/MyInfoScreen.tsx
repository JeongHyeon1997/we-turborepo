import { useState } from 'react';
import { View, Text, Image, Pressable, Alert, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { petColors } from '@we/utils';
import type { CommunityPost, FamilyGroup, FamilyMember } from '@we/utils';
import { AnnouncementBanner, DatePickerModal } from '@we/ui';
import { communityPosts } from '../data/communityPosts';
import { announcements } from '../data/announcements';

const ACCENT = '#97A4D9';

function daysBetween(isoDate: string) {
  const start = new Date(isoDate);
  const now   = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
}

interface FamilySectionProps {
  group: FamilyGroup | null;
  onConnectPress: () => void;
  onUpdateGroup: (g: FamilyGroup | null) => void;
}

function FamilySection({ group, onConnectPress, onUpdateGroup }: FamilySectionProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!group) {
    return (
      <Pressable
        style={({ pressed }) => [fs.connectCard, pressed && { opacity: 0.8 }]}
        onPress={onConnectPress}
      >
        <Text style={fs.connectEmoji}>🐾</Text>
        <View style={fs.connectBody}>
          <Text style={fs.connectTitle}>가족을 초대해주세요</Text>
          <Text style={fs.connectSub}>함께 일기를 작성하려면 가족 연결이 필요합니다.</Text>
        </View>
        <Text style={fs.connectArrow}>초대코드 입력하러 가기 →</Text>
      </Pressable>
    );
  }

  function removeMember(member: FamilyMember) {
    Alert.alert('가족 제거', `${member.name}님을 가족에서 제거할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '제거', style: 'destructive',
        onPress: () => {
          const members = group.members.filter(m => m.id !== member.id);
          onUpdateGroup(members.length === 0 ? null : { ...group, members });
        },
      },
    ]);
  }

  function leaveGroup() {
    Alert.alert('그룹 해제', '가족 그룹을 해제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '해제', style: 'destructive', onPress: () => onUpdateGroup(null) },
    ]);
  }

  return (
    <View style={fs.card}>
      {/* 아바타 행 */}
      <View style={fs.avatarRow}>
        <View style={[fs.avatar, { backgroundColor: ACCENT + '88' }]}>
          <Text style={fs.avatarText}>나</Text>
        </View>
        {group.members.map(m => (
          <View key={m.id} style={[fs.avatar, { backgroundColor: m.avatarColor }]}>
            <Text style={fs.avatarText}>{m.name[0]}</Text>
          </View>
        ))}
      </View>

      <Text style={fs.daysText}>가족과 함께한지 {daysBetween(group.groupStartDate)}일째 🐾</Text>

      {/* 시작일 편집 */}
      <Pressable style={({ pressed }) => [fs.dateRow, pressed && { opacity: 0.7 }]} onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar-outline" size={16} color={ACCENT} />
        <Text style={fs.dateLabel}>그룹 시작일</Text>
        <Text style={fs.dateValue}>{group.groupStartDate.replace(/-/g, '.')}</Text>
        <Ionicons name="pencil-outline" size={14} color={petColors.gray400} />
      </Pressable>

      {/* 멤버 목록 */}
      {group.members.map(m => (
        <View key={m.id} style={fs.memberRow}>
          <View style={[fs.memberDot, { backgroundColor: m.avatarColor }]} />
          <Text style={fs.memberName}>{m.name}</Text>
          <Pressable onPress={() => removeMember(m)} hitSlop={8}>
            <Ionicons name="close-circle-outline" size={18} color={petColors.gray400} />
          </Pressable>
        </View>
      ))}

      {/* 액션 버튼 */}
      <View style={fs.actionRow}>
        <Pressable style={({ pressed }) => [fs.addBtn, pressed && { opacity: 0.8 }]} onPress={onConnectPress}>
          <Text style={fs.addBtnText}>+ 가족 추가</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [fs.leaveBtn, pressed && { opacity: 0.7 }]} onPress={leaveGroup}>
          <Text style={fs.leaveBtnText}>그룹 해제</Text>
        </Pressable>
      </View>

      <DatePickerModal
        visible={showDatePicker}
        value={group.groupStartDate}
        title="그룹 시작일 선택"
        accentColor={ACCENT}
        onConfirm={date => { onUpdateGroup({ ...group, groupStartDate: date }); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
}

const myName = '우리아이';
const mockUser = { nickname: myName, profileImage: null as string | null, followers: 84, following: 32 };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function CommunityItem({ post }: { post: CommunityPost }) {
  return (
    <View style={s.item}>
      {post.image && (
        <View style={s.itemThumb}>
          <Image source={{ uri: post.image }} style={s.itemThumbImg} resizeMode="cover" />
        </View>
      )}
      <View style={s.itemBody}>
        <Text style={s.itemContent} numberOfLines={2}>{post.content}</Text>
        <Text style={s.itemMeta}>{formatDate(post.createdAt)} · 🤍 {post.likes}</Text>
      </View>
    </View>
  );
}

interface Props {
  onAnnouncementPress: (id: string) => void;
  group: FamilyGroup | null;
  onConnectPress: () => void;
  onUpdateGroup: (g: FamilyGroup | null) => void;
}

export function MyInfoScreen({ onAnnouncementPress, group, onConnectPress, onUpdateGroup }: Props) {
  const myCommunityPosts = communityPosts.filter(p => p.author.name === myName);

  const Header = (
    <View>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#97A4D9"
        onPress={onAnnouncementPress}
      />
      <View style={s.familySectionWrap}>
        <FamilySection
          group={group}
          onConnectPress={onConnectPress}
          onUpdateGroup={onUpdateGroup}
        />
      </View>
      <View style={s.profileSection}>
        <View style={s.avatarWrap}>
          {mockUser.profileImage ? (
            <Image source={{ uri: mockUser.profileImage }} style={s.avatar} />
          ) : (
            <View style={[s.avatar, s.avatarPlaceholder]}>
              <Ionicons name="person" size={48} color={petColors.gray400} />
            </View>
          )}
        </View>
        <Text style={s.nickname}>{mockUser.nickname}</Text>
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statNumber}>{mockUser.followers}</Text>
            <Text style={s.statLabel}>팔로워</Text>
          </View>
          <View style={s.divider} />
          <View style={s.statItem}>
            <Text style={s.statNumber}>{mockUser.following}</Text>
            <Text style={s.statLabel}>팔로잉</Text>
          </View>
        </View>
        <Pressable style={({ pressed }) => [s.editButton, pressed && s.editButtonPressed]}>
          <Text style={s.editButtonText}>프로필 편집</Text>
        </Pressable>
      </View>

      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>커뮤니티 글</Text>
        <View style={s.sectionBadge}>
          <Text style={s.sectionBadgeText}>{myCommunityPosts.length}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={myCommunityPosts}
      keyExtractor={item => item.id}
      ListHeaderComponent={Header}
      ListEmptyComponent={<Text style={s.empty}>아직 작성한 글이 없어요.</Text>}
      renderItem={({ item }) => <CommunityItem post={item} />}
    />
  );
}

const fs = StyleSheet.create({
  connectCard: {
    margin: 16, marginBottom: 0,
    padding: 16, borderRadius: 16,
    borderWidth: 1.5, borderColor: ACCENT,
    borderStyle: 'dashed',
    backgroundColor: ACCENT + '0d',
    alignItems: 'center', gap: 6,
  },
  connectEmoji: { fontSize: 28 },
  connectBody: { alignItems: 'center', gap: 2 },
  connectTitle: { fontSize: 15, fontFamily: 'BMJUA', color: ACCENT },
  connectSub: { fontSize: 12, fontFamily: 'BMHANNAPro', color: petColors.gray500, textAlign: 'center' },
  connectArrow: { fontSize: 12, fontFamily: 'BMJUA', color: ACCENT, marginTop: 4 },
  card: {
    margin: 16, marginBottom: 0,
    padding: 18, borderRadius: 20,
    backgroundColor: petColors.white,
    borderWidth: 1, borderColor: ACCENT + '33',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
    gap: 10,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontFamily: 'BMJUA', color: '#fff' },
  daysText: { fontSize: 18, fontFamily: 'BMJUA', color: ACCENT },
  dateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: ACCENT + '15', borderRadius: 12,
  },
  dateLabel: { flex: 1, fontSize: 13, fontFamily: 'BMJUA', color: petColors.gray700 },
  dateValue: { fontSize: 13, fontFamily: 'BMHANNAPro', color: petColors.gray600 },
  memberRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: petColors.gray50, borderRadius: 10,
  },
  memberDot: { width: 10, height: 10, borderRadius: 5 },
  memberName: { flex: 1, fontSize: 14, fontFamily: 'BMJUA', color: petColors.gray800 },
  actionRow: { flexDirection: 'row', gap: 8 },
  addBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: ACCENT, alignItems: 'center',
  },
  addBtnText: { fontSize: 14, fontFamily: 'BMJUA', color: ACCENT },
  leaveBtn: {
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12,
    borderWidth: 1, borderColor: petColors.gray200, alignItems: 'center',
  },
  leaveBtnText: { fontSize: 13, fontFamily: 'BMJUA', color: petColors.gray400 },
});

const s = StyleSheet.create({
  familySectionWrap: {},
  profileSection: { alignItems: 'center', paddingTop: 32, paddingHorizontal: 24, paddingBottom: 24 },
  avatarWrap: { marginBottom: 14 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarPlaceholder: { backgroundColor: petColors.gray100, alignItems: 'center', justifyContent: 'center' },
  nickname: { fontSize: 20, fontFamily: 'BMJUA', color: petColors.gray900, marginBottom: 18 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  statItem: { alignItems: 'center', paddingHorizontal: 28 },
  statNumber: { fontSize: 20, fontFamily: 'BMJUA', color: petColors.gray900 },
  statLabel: { fontSize: 13, color: petColors.gray500, marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: petColors.gray200 },
  editButton: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: petColors.blue },
  editButtonPressed: { backgroundColor: petColors.surface },
  editButtonText: { fontSize: 14, fontFamily: 'BMJUA', color: petColors.gray700 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: petColors.gray100,
  },
  sectionTitle: { fontSize: 14, fontFamily: 'BMJUA', color: petColors.gray800 },
  sectionBadge: { backgroundColor: petColors.surface, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  sectionBadgeText: { fontSize: 11, fontFamily: 'BMJUA', color: petColors.gray600 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 14, borderBottomWidth: 1, borderBottomColor: petColors.gray100,
  },
  itemThumb: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0 },
  itemThumbImg: { width: '100%', height: '100%' },
  itemBody: { flex: 1 },
  itemContent: { fontSize: 13, fontFamily: 'BMHANNAPro', color: petColors.gray600, marginBottom: 4 },
  itemMeta: { fontSize: 12, color: petColors.gray400 },
  empty: { textAlign: 'center', padding: 40, color: petColors.gray400, fontFamily: 'BMJUA', fontSize: 14 },
});

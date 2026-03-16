import { useState } from 'react';
import { View, Text, Image, Pressable, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { coupleColors } from '@we/utils';
import type { CommunityPost, DiaryEntry } from '@we/utils';
import { AnnouncementBanner } from '@we/ui';
import { communityPosts } from '../data/communityPosts';
import { myDiaryEntries } from '../data/diaryEntries';
import { announcements } from '../data/announcements';

const myName = '우리커플';
const mockUser = { nickname: myName, profileImage: null as string | null, followers: 128, following: 64 };

type FilterType = '전체' | '커뮤니티' | '일기';
type FeedItem =
  | { kind: 'community'; data: CommunityPost }
  | { kind: 'diary'; data: DiaryEntry };

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
      <View style={[s.badge, { backgroundColor: coupleColors.primary100 }]}>
        <Text style={s.badgeText}>커뮤니티</Text>
      </View>
    </View>
  );
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
        <Text style={s.itemMeta}>{formatDate(entry.createdAt)}</Text>
      </View>
      <View style={[s.badge, { backgroundColor: coupleColors.secondary200 }]}>
        <Text style={s.badgeText}>일기</Text>
      </View>
    </View>
  );
}

interface Props {
  onAnnouncementPress: (id: string) => void;
}

export function MyInfoScreen({ onAnnouncementPress }: Props) {
  const [filter, setFilter] = useState<FilterType>('전체');

  const myCommunityPosts = communityPosts.filter(p => p.author.name === myName);

  const feed: FeedItem[] = [
    ...(filter !== '일기' ? myCommunityPosts.map(p => ({ kind: 'community' as const, data: p })) : []),
    ...(filter !== '커뮤니티' ? myDiaryEntries.map(e => ({ kind: 'diary' as const, data: e })) : []),
  ].sort((a, b) => b.data.createdAt.localeCompare(a.data.createdAt));

  const filters: FilterType[] = ['전체', '커뮤니티', '일기'];

  const Header = (
    <View>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#f4a0a0"
        onPress={onAnnouncementPress}
      />
      {/* Profile */}
      <View style={s.profileSection}>
        <View style={s.avatarWrap}>
          {mockUser.profileImage ? (
            <Image source={{ uri: mockUser.profileImage }} style={s.avatar} />
          ) : (
            <View style={[s.avatar, s.avatarPlaceholder]}>
              <Ionicons name="person" size={48} color={coupleColors.gray400} />
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

      {/* Filter */}
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
      renderItem={({ item }) =>
        item.kind === 'community'
          ? <CommunityItem post={item.data as CommunityPost} />
          : <DiaryItem entry={item.data as DiaryEntry} />
      }
    />
  );
}

const s = StyleSheet.create({
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
});

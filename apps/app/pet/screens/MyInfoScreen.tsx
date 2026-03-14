import { View, Text, Image, Pressable, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { petColors } from '@we/utils';
import type { CommunityPost } from '@we/utils';
import { communityPosts } from '../data/communityPosts';

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

export function MyInfoScreen() {
  const myCommunityPosts = communityPosts.filter(p => p.author.name === myName);

  const Header = (
    <View>
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

const s = StyleSheet.create({
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

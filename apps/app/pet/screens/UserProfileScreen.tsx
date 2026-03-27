import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { petColors } from '@we/utils';
import type { CommunityPostBase } from '@we/utils';
import { communityPosts } from '../data/communityPosts';
import { userProfiles } from '../data/userProfiles';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function CommunityItem({ post }: { post: CommunityPostBase }) {
  return (
    <View style={s.item}>
      {post.imageUrl && (
        <View style={s.itemThumb}>
          <Image source={{ uri: post.imageUrl }} style={s.itemThumbImg} resizeMode="cover" />
        </View>
      )}
      <View style={s.itemBody}>
        <Text style={s.itemContent} numberOfLines={2}>{post.content}</Text>
        <Text style={s.itemMeta}>{formatDate(post.createdAt)} · 🤍 {post.likeCount}</Text>
      </View>
    </View>
  );
}

interface Props {
  authorName: string;
}

export function UserProfileScreen({ authorName }: Props) {
  const profile = userProfiles[authorName];
  const posts = communityPosts.filter(p => p.authorNickname === authorName);
  const avatarColor = profile?.avatarColor
    ?? petColors.gray200;

  const Header = (
    <View>
      <View style={s.profileSection}>
        <View style={[s.avatar, { backgroundColor: avatarColor, alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name="person" size={48} color={petColors.gray500} />
        </View>
        <Text style={s.nickname}>{authorName}</Text>
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statNumber}>{profile?.followers ?? '—'}</Text>
            <Text style={s.statLabel}>팔로워</Text>
          </View>
          <View style={s.divider} />
          <View style={s.statItem}>
            <Text style={s.statNumber}>{profile?.following ?? '—'}</Text>
            <Text style={s.statLabel}>팔로잉</Text>
          </View>
        </View>
      </View>

      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>커뮤니티 글</Text>
        <View style={s.sectionBadge}>
          <Text style={s.sectionBadgeText}>{posts.length}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      ListHeaderComponent={Header}
      ListEmptyComponent={<Text style={s.empty}>아직 작성한 글이 없어요.</Text>}
      renderItem={({ item }) => <CommunityItem post={item} />}
    />
  );
}

const s = StyleSheet.create({
  profileSection: { alignItems: 'center', paddingTop: 32, paddingHorizontal: 24, paddingBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 14 },
  nickname: { fontSize: 20, fontFamily: 'BMJUA', color: petColors.gray900, marginBottom: 18 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { alignItems: 'center', paddingHorizontal: 28 },
  statNumber: { fontSize: 20, fontFamily: 'BMJUA', color: petColors.gray900 },
  statLabel: { fontSize: 13, color: petColors.gray500, marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: petColors.gray200 },
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

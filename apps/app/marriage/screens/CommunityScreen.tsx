import { useState, useRef } from 'react';
import {
  View, Text, Image, Pressable, FlatList,
  Animated, StyleSheet,
} from 'react-native';
import { marriageColors } from '@we/utils';
import type { CommunityPost } from '@we/utils';
import { AnnouncementBanner, ReportModal } from '@we/ui';
import { communityPosts as initialPosts } from '../data/communityPosts';
import { announcements } from '../data/announcements';

type Post = CommunityPost & { liked: boolean };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function PostCard({
  post, onLike, onPress, onAuthorPress, onReport,
}: {
  post: Post;
  onLike: () => void;
  onPress: () => void;
  onAuthorPress: () => void;
  onReport: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  function handleLike() {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.4, useNativeDriver: true, speed: 30 }),
      Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 30 }),
      Animated.spring(scale, { toValue: 1,   useNativeDriver: true, speed: 30 }),
    ]).start();
    onLike();
  }

  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.cardHeader}>
        <View style={[s.avatar, { backgroundColor: post.author.avatarColor }]}>
          <Text style={s.avatarText}>{post.author.name[0]}</Text>
        </View>
        <View style={s.authorInfo}>
          <Pressable onPress={(e) => { e.stopPropagation?.(); onAuthorPress(); }} hitSlop={4}>
            <Text style={s.authorName}>{post.author.name}</Text>
          </Pressable>
          <Text style={s.date}>{formatDate(post.createdAt)}</Text>
        </View>
        <Pressable style={s.moreBtn} onPress={(e) => { e.stopPropagation?.(); onReport(); }} hitSlop={8}>
          <Text style={s.moreBtnText}>···</Text>
        </Pressable>
      </View>

      <Text style={s.content} numberOfLines={3}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={s.image} resizeMode="cover" />
      )}

      <View style={s.actions}>
        <Pressable style={s.actionBtn} onPress={handleLike} hitSlop={8}>
          <Animated.Text style={[s.actionIcon, { transform: [{ scale }] }]}>
            {post.liked ? '❤️' : '🤍'}
          </Animated.Text>
          <Text style={[s.actionCount, post.liked && { color: '#ef4444' }]}>{post.likes}</Text>
        </Pressable>

        <Pressable style={s.actionBtn} onPress={onPress} hitSlop={8}>
          <Text style={s.actionIcon}>💬</Text>
          <Text style={s.actionCount}>{post.comments}</Text>
        </Pressable>

        <Pressable style={s.actionBtn} hitSlop={8}>
          <Text style={s.actionIcon}>↗️</Text>
          <Text style={s.actionCount}>공유</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

interface Props {
  onPostPress: (post: CommunityPost) => void;
  onAuthorPress: (name: string) => void;
  onAnnouncementPress: (id: string) => void;
}

export function CommunityScreen({ onPostPress, onAuthorPress, onAnnouncementPress }: Props) {
  const [posts, setPosts] = useState<Post[]>(
    initialPosts.map(p => ({ ...p, liked: false }))
  );
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);

  function toggleLike(id: string) {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  const banner = (
    <AnnouncementBanner
      announcements={announcements}
      accentColor="#c9a96e"
      onPress={onAnnouncementPress}
    />
  );

  return (
    <>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        contentContainerStyle={s.list}
        ListHeaderComponent={banner}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => toggleLike(item.id)}
            onPress={() => onPostPress(item)}
            onAuthorPress={() => onAuthorPress(item.author.name)}
            onReport={() => setReportTargetId(item.id)}
          />
        )}
      />
      <ReportModal
        visible={reportTargetId !== null}
        targetType="post"
        accentColor="#c9a96e"
        onSubmit={(_reasons, _text) => { /* TODO: API 연동 */ }}
        onClose={() => setReportTargetId(null)}
      />
    </>
  );
}

const s = StyleSheet.create({
  list: { padding: 16 },
  card: {
    backgroundColor: marriageColors.white,
    borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 14, paddingBottom: 0,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontFamily: 'BMJUA', color: marriageColors.gray700 },
  authorInfo: { gap: 2, flex: 1 },
  authorName: { fontSize: 14, fontFamily: 'BMJUA', color: marriageColors.gray800 },
  date: { fontSize: 12, color: marriageColors.gray400, fontFamily: 'BMHANNAPro' },
  moreBtn: { padding: 4 },
  moreBtnText: { fontSize: 18, color: marriageColors.gray400, letterSpacing: 1 },
  content: {
    margin: 14, marginBottom: 10, fontSize: 14, lineHeight: 22,
    color: marriageColors.gray700, fontFamily: 'BMHANNAPro',
  },
  image: { width: '100%', aspectRatio: 3 / 2 },
  actions: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: marriageColors.gray100,
    marginTop: 4, gap: 4,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, paddingHorizontal: 8, paddingVertical: 6,
  },
  actionIcon: { fontSize: 20 },
  actionCount: { fontSize: 13, color: marriageColors.gray500, fontFamily: 'BMJUA' },
});

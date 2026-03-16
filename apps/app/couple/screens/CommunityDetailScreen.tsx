import { useState, useRef } from 'react';
import { View, Text, Image, Pressable, ScrollView, Animated, StyleSheet } from 'react-native';
import { coupleColors } from '@we/utils';
import type { CommunityPost } from '@we/utils';
import { ReportModal } from '@we/ui';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

interface Props {
  post: CommunityPost;
}

export function CommunityDetailScreen({ post }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showReport, setShowReport] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  function handleLike() {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.4, useNativeDriver: true, speed: 30 }),
      Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 30 }),
      Animated.spring(scale, { toValue: 1,   useNativeDriver: true, speed: 30 }),
    ]).start();
    setLiked(prev => {
      setLikeCount(c => prev ? c - 1 : c + 1);
      return !prev;
    });
  }

  return (
    <>
      <ScrollView contentContainerStyle={s.page}>
        {/* Author */}
        <View style={s.header}>
          <View style={[s.avatar, { backgroundColor: post.author.avatarColor }]}>
            <Text style={s.avatarText}>{post.author.name[0]}</Text>
          </View>
          <View style={s.authorInfo}>
            <Text style={s.authorName}>{post.author.name}</Text>
            <Text style={s.date}>{formatDate(post.createdAt)}</Text>
          </View>
          {/* ⋯ 더보기 버튼 */}
          <Pressable style={s.moreBtn} onPress={() => setShowReport(true)} hitSlop={8}>
            <Text style={s.moreBtnText}>···</Text>
          </Pressable>
        </View>

        {/* Content */}
        <Text style={s.content}>{post.content}</Text>

        {/* Image */}
        {post.image && (
          <Image source={{ uri: post.image }} style={s.image} resizeMode="cover" />
        )}

        {/* Actions */}
        <View style={s.actions}>
          <Pressable style={s.actionBtn} onPress={handleLike} hitSlop={8}>
            <Animated.Text style={[s.actionIcon, { transform: [{ scale }] }]}>
              {liked ? '❤️' : '🤍'}
            </Animated.Text>
            <Text style={[s.actionCount, liked && { color: '#ef4444' }]}>{likeCount}</Text>
          </Pressable>

          <Pressable style={s.actionBtn} hitSlop={8}>
            <Text style={s.actionIcon}>💬</Text>
            <Text style={s.actionCount}>{post.comments}</Text>
          </Pressable>

          <Pressable style={s.actionBtn} hitSlop={8}>
            <Text style={s.actionIcon}>↗️</Text>
            <Text style={s.actionCount}>공유</Text>
          </Pressable>
        </View>

        {/* Comment placeholder */}
        <View style={s.commentSection}>
          <Text style={s.commentPlaceholder}>댓글 기능은 준비 중이에요 💬</Text>
        </View>
      </ScrollView>

      <ReportModal
        visible={showReport}
        targetType="post"
        accentColor="#f4a0a0"
        onSubmit={(_reasons, _text) => { /* TODO: API 연동 */ }}
        onClose={() => setShowReport(false)}
      />
    </>
  );
}

const s = StyleSheet.create({
  page: { padding: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 12,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontFamily: 'BMJUA', color: coupleColors.gray700 },
  authorInfo: { gap: 2, flex: 1 },
  authorName: { fontSize: 15, fontFamily: 'BMJUA', color: coupleColors.gray800 },
  date: { fontSize: 12, color: coupleColors.gray400, fontFamily: 'BMHANNAPro' },
  moreBtn: { padding: 4 },
  moreBtnText: { fontSize: 18, color: coupleColors.gray400, letterSpacing: 1 },
  content: {
    fontSize: 15, lineHeight: 26,
    color: coupleColors.gray700, fontFamily: 'BMHANNAPro', marginBottom: 16,
  },
  image: { width: '100%', aspectRatio: 3 / 2, borderRadius: 10, marginBottom: 16 },
  actions: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: coupleColors.gray100,
    marginBottom: 20, gap: 4,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, paddingHorizontal: 8, paddingVertical: 6,
  },
  actionIcon: { fontSize: 22 },
  actionCount: { fontSize: 14, color: coupleColors.gray500, fontFamily: 'BMJUA' },
  commentSection: { paddingVertical: 16 },
  commentPlaceholder: {
    textAlign: 'center', color: coupleColors.gray400,
    fontFamily: 'BMJUA', fontSize: 14,
  },
});

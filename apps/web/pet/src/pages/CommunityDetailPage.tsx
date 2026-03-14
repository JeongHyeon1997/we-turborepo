import { useState, useRef, CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { petColors } from '@we/utils';
import { communityPosts } from '../data/communityPosts';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = communityPosts.find(p => p.id === id);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes ?? 0);
  const [animating, setAnimating] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!post) {
    return <div style={s.notFound}>게시글을 찾을 수 없어요.</div>;
  }

  function handleLike() {
    if (animRef.current) clearTimeout(animRef.current);
    setAnimating(true);
    animRef.current = setTimeout(() => setAnimating(false), 400);
    setLiked(prev => {
      setLikeCount(c => prev ? c - 1 : c + 1);
      return !prev;
    });
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={{ ...s.avatar, backgroundColor: post.author.avatarColor }}>
          <span style={s.avatarText}>{post.author.name[0]}</span>
        </div>
        <div style={s.authorInfo}>
          <span style={s.authorName}>{post.author.name}</span>
          <span style={s.date}>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      <p style={s.content}>{post.content}</p>

      {post.image && (
        <img src={post.image} alt="" style={s.image} />
      )}

      <div style={s.actions}>
        <button
          style={s.actionBtn}
          onClick={handleLike}
          className={animating ? 'animate-heart-bounce' : ''}
        >
          <span style={{ color: liked ? '#ef4444' : petColors.gray400, fontSize: 22, transition: 'color 0.2s' }}>
            {liked ? '❤️' : '🤍'}
          </span>
          <span style={{ ...s.actionCount, color: liked ? '#ef4444' : petColors.gray500 }}>
            {likeCount}
          </span>
        </button>

        <button style={s.actionBtn}>
          <span style={{ fontSize: 22 }}>💬</span>
          <span style={s.actionCount}>{post.comments}</span>
        </button>

        <button style={s.actionBtn} onClick={() => navigator.share?.({ url: window.location.href })}>
          <span style={{ fontSize: 22 }}>↗️</span>
          <span style={s.actionCount}>공유</span>
        </button>
      </div>

      <div style={s.commentSection}>
        <p style={s.commentPlaceholder}>댓글 기능은 준비 중이에요 💬</p>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    padding: '16px',
  },
  notFound: {
    padding: 32,
    textAlign: 'center',
    color: petColors.gray400,
    fontFamily: 'BMJUA, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 700,
    color: petColors.gray700,
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: 700,
    color: petColors.gray800,
    fontFamily: 'BMJUA, sans-serif',
  },
  date: {
    fontSize: 12,
    color: petColors.gray400,
  },
  content: {
    fontSize: 15,
    lineHeight: 1.7,
    color: petColors.gray700,
    fontFamily: 'BMHANNAPro, sans-serif',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    borderRadius: 10,
    objectFit: 'cover',
    display: 'block',
    marginBottom: 16,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    paddingBlock: 10,
    borderTop: `1px solid ${petColors.gray100}`,
    borderBottom: `1px solid ${petColors.gray100}`,
    marginBottom: 20,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 8,
    fontFamily: 'BMJUA, sans-serif',
  },
  actionCount: {
    fontSize: 14,
    color: petColors.gray500,
  },
  commentSection: {
    padding: '16px 0',
  },
  commentPlaceholder: {
    textAlign: 'center',
    color: petColors.gray400,
    fontFamily: 'BMJUA, sans-serif',
    fontSize: 14,
  },
};

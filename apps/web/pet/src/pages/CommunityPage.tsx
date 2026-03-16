import { useState, useRef, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { petColors } from '@we/utils';
import type { CommunityPost } from '@we/utils';
import { AnnouncementBanner } from '@we/ui-web';
import { communityPosts as initialPosts } from '../data/communityPosts';
import { announcements } from '../data/announcements';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function Avatar({ color, name }: { color: string; name: string }) {
  return (
    <div style={{ ...s.avatar, backgroundColor: color }}>
      <span style={s.avatarText}>{name[0]}</span>
    </div>
  );
}

function PostCard({ post, onLike }: { post: CommunityPost & { liked: boolean }; onLike: () => void }) {
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (animRef.current) clearTimeout(animRef.current);
    setAnimating(true);
    animRef.current = setTimeout(() => setAnimating(false), 400);
    onLike();
  }

  return (
    <div style={s.card} onClick={() => navigate(`/community/${post.id}`)}>
      <div style={s.cardHeader}>
        <Avatar color={post.author.avatarColor} name={post.author.name} />
        <div style={s.authorInfo}>
          <span
            style={s.authorName}
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${encodeURIComponent(post.author.name)}`); }}
          >
            {post.author.name}
          </span>
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
          <span style={{ color: post.liked ? '#ef4444' : petColors.gray400, fontSize: 20, transition: 'color 0.2s' }}>
            {post.liked ? '❤️' : '🤍'}
          </span>
          <span style={{ ...s.actionCount, color: post.liked ? '#ef4444' : petColors.gray500 }}>
            {post.likes}
          </span>
        </button>

        <button style={s.actionBtn} onClick={(e) => { e.stopPropagation(); navigate(`/community/${post.id}`); }}>
          <span style={{ fontSize: 20 }}>💬</span>
          <span style={s.actionCount}>{post.comments}</span>
        </button>

        <button style={s.actionBtn} onClick={(e) => { e.stopPropagation(); navigator.share?.({ url: window.location.href }); }}>
          <span style={{ fontSize: 20 }}>↗️</span>
          <span style={s.actionCount}>공유</span>
        </button>
      </div>
    </div>
  );
}

export function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<(CommunityPost & { liked: boolean })[]>(
    initialPosts.map(p => ({ ...p, liked: false }))
  );

  function toggleLike(id: string) {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  return (
    <div>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#97A4D9"
        onPress={(id) => navigate(`/announcements/${id}`)}
      />
      <div style={s.page}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />
        ))}
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '12px 16px',
  },
  card: {
    backgroundColor: petColors.white,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 14px 0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 700,
    color: petColors.gray700,
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 700,
    color: petColors.gray800,
    fontFamily: 'BMJUA, sans-serif',
    cursor: 'pointer',
  },
  date: {
    fontSize: 12,
    color: petColors.gray400,
  },
  content: {
    margin: '10px 14px',
    fontSize: 14,
    lineHeight: 1.6,
    color: petColors.gray700,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  image: {
    width: '100%',
    aspectRatio: '3/2',
    objectFit: 'cover',
    display: 'block',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '10px 10px',
    borderTop: `1px solid ${petColors.gray100}`,
    marginTop: 4,
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
    fontSize: 13,
    color: petColors.gray500,
  },
};

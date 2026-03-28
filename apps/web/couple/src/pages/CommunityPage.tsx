import { useState, useRef, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { coupleColors } from '@we/utils';
import type { CommunityPostBase } from '@we/utils';
import { AnnouncementBanner, ReportModal, AuthPromptModal } from '@we/ui-web';
import { IoAdd } from 'react-icons/io5';
import { announcements } from '../data/announcements';
import { getPosts, toggleLike as apiToggleLike, reportPost } from '../api/community.api';
import { useAuth } from '../data/authStore';

// Backend returns author as nested object; map to flat CommunityPostBase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(raw: any): CommunityPostBase {
  return {
    ...raw,
    authorNickname: raw.author?.nickname ?? raw.authorNickname ?? '',
  };
}

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

function PostCard({
  post,
  onLike,
  onReport,
}: {
  post: CommunityPostBase;
  onLike: () => void;
  onReport: () => void;
}) {
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
        <Avatar color={'#E5E7EB'} name={post.authorNickname} />
        <div style={s.authorInfo}>
          <span
            style={s.authorName}
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${encodeURIComponent(post.authorNickname)}`); }}
          >
            {post.authorNickname}
          </span>
          <span style={s.date}>{formatDate(post.createdAt)}</span>
        </div>

        {/* ⋯ 더보기 버튼 */}
        <div style={s.moreWrap} onClick={e => e.stopPropagation()}>
          <button
            style={s.moreBtn}
            onClick={() => setMenuOpen(v => !v)}
          >
            ···
          </button>
          {menuOpen && (
            <>
              <div style={s.menuBackdrop} onClick={() => setMenuOpen(false)} />
              <div style={s.menu}>
                <button
                  style={s.menuItem}
                  onClick={() => { setMenuOpen(false); onReport(); }}
                >
                  🚨 신고하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p style={s.content}>{post.content}</p>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <div style={post.imageUrls.length === 1 ? undefined : s.imageGrid}>
          {post.imageUrls.map((url, i) => (
            <img key={i} src={url} alt="" style={post.imageUrls!.length === 1 ? s.imageSingle : s.imageGridItem} />
          ))}
        </div>
      )}

      <div style={s.actions}>
        <button
          style={s.actionBtn}
          onClick={handleLike}
          className={animating ? 'animate-heart-bounce' : ''}
        >
          <span style={{ color: post.liked ? '#ef4444' : coupleColors.gray400, fontSize: 20, transition: 'color 0.2s' }}>
            {post.liked ? '❤️' : '🤍'}
          </span>
          <span style={{ ...s.actionCount, color: post.liked ? '#ef4444' : coupleColors.gray500 }}>
            {post.likeCount}
          </span>
        </button>

        <button style={s.actionBtn} onClick={(e) => { e.stopPropagation(); navigate(`/community/${post.id}`); }}>
          <span style={{ fontSize: 20 }}>💬</span>
          <span style={s.actionCount}>{post.commentCount}</span>
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
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState<CommunityPostBase[]>([]);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    getPosts({ page: 0, size: 20 }).then(res => {
      setPosts(res.data.content.map(mapPost));
    }).catch(() => {});
  }, [isLoggedIn]);

  async function handleToggleLike(id: string) {
    if (!isLoggedIn) { setShowAuthPrompt(true); return; }
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    );
    await apiToggleLike(id).catch(() => {
      // revert on error
      setPosts(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
            : p
        )
      );
    });
  }

  async function handleReport(reasons: string[], text: string) {
    if (!reportTargetId) return;
    await reportPost(reportTargetId, { reason: reasons.join(',') + (text ? ` ${text}` : '') }).catch(() => {});
    setReportTargetId(null);
  }

  return (
    <div style={{ position: 'relative' }}>
      <AnnouncementBanner
        announcements={announcements}
        accentColor="#f4a0a0"
        onPress={(id) => navigate(`/announcements/${id}`)}
      />
      <div style={s.page}>
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => handleToggleLike(post.id)}
            onReport={() => setReportTargetId(post.id)}
          />
        ))}
      </div>

      <button
        style={{ ...s.fab, backgroundColor: '#f4a0a0' }}
        onClick={() => isLoggedIn ? navigate('/community/write') : setShowAuthPrompt(true)}
      >
        <IoAdd size={28} color="#fff" />
      </button>

      <ReportModal
        visible={reportTargetId !== null}
        targetType="post"
        accentColor="#f4a0a0"
        onSubmit={handleReport}
        onClose={() => setReportTargetId(null)}
      />

      <AuthPromptModal
        visible={showAuthPrompt}
        message="커뮤니티 기능은 로그인 후 이용할 수 있어요."
        accentColor="#f4a0a0"
        onLoginPress={() => { setShowAuthPrompt(false); navigate('/auth'); }}
        onClose={() => setShowAuthPrompt(false)}
      />
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
    backgroundColor: coupleColors.white,
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
    color: coupleColors.gray700,
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 700,
    color: coupleColors.gray800,
    fontFamily: 'BMJUA, sans-serif',
    cursor: 'pointer',
  },
  date: {
    fontSize: 12,
    color: coupleColors.gray400,
  },
  moreWrap: {
    position: 'relative',
  },
  moreBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: coupleColors.gray400,
    padding: '4px 8px',
    letterSpacing: 1,
    fontFamily: 'inherit',
  },
  menuBackdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 99,
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    border: '1px solid #e5e7eb',
    zIndex: 100,
    minWidth: 120,
    overflow: 'hidden',
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'BMJUA, sans-serif',
    color: '#ef4444',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  content: {
    margin: '10px 14px',
    fontSize: 14,
    lineHeight: 1.6,
    color: coupleColors.gray700,
    fontFamily: 'BMHANNAPro, sans-serif',
  },
  imageSingle: {
    width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block',
  },
  imageGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2,
  },
  imageGridItem: {
    width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block',
  },
  fab: {
    position: 'fixed', bottom: 80, right: 20,
    width: 52, height: 52, borderRadius: 26,
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)', zIndex: 50,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '10px 10px',
    borderTop: `1px solid ${coupleColors.gray100}`,
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
    color: coupleColors.gray500,
  },
};

import { useState, useRef, type CSSProperties, type ChangeEvent } from 'react';
import { IoImageOutline, IoClose } from 'react-icons/io5';

const N = {
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray300: '#d1d5db', gray400: '#9ca3af', gray500: '#6b7280',
  gray600: '#4b5563', gray700: '#374151', white: '#ffffff',
};

export interface CommunityWriteFeatureProps {
  accentColor: string;
  onSubmit: (data: { content: string; imageUrls: string[] }) => Promise<void>;
  onCancel: () => void;
  onUploadImage?: (file: File) => Promise<string>;
}

export function CommunityWriteFeature({
  accentColor,
  onSubmit,
  onCancel,
  onUploadImage,
}: CommunityWriteFeatureProps) {
  const [content, setContent]           = useState('');
  const [images, setImages]             = useState<{ url: string; file?: File }[]>([]);
  const [uploading, setUploading]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canPost = content.trim().length > 0 && !submitting && !uploading;

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = '';

    if (onUploadImage) {
      setUploading(true);
      try {
        const uploaded = await Promise.all(
          files.map(async (file) => {
            const url = await onUploadImage(file);
            return { url };
          })
        );
        setImages(prev => [...prev, ...uploaded]);
      } catch {
        alert('이미지 업로드에 실패했습니다.');
      } finally {
        setUploading(false);
      }
    } else {
      // 로컬 미리보기 (비로그인)
      const previews = files.map(file => ({ url: URL.createObjectURL(file), file }));
      setImages(prev => [...prev, ...previews]);
    }
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit() {
    if (!canPost) return;
    setSubmitting(true);
    try {
      await onSubmit({ content: content.trim(), imageUrls: images.map(i => i.url) });
    } catch {
      alert('게시에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={s.page}>
      {/* ── 상단 액션 바 ── */}
      <div style={s.topBar}>
        <button style={s.cancelBtn} onClick={onCancel} disabled={submitting}>취소</button>
        <span style={s.topTitle}>새 게시물</span>
        <button
          style={{ ...s.postBtn, backgroundColor: canPost ? accentColor : N.gray200, color: canPost ? '#fff' : N.gray400 }}
          onClick={handleSubmit}
          disabled={!canPost}
        >
          {submitting ? '게시 중...' : '게시하기'}
        </button>
      </div>

      {/* ── 본문 영역 ── */}
      <div style={s.body}>
        <textarea
          style={s.textarea}
          placeholder="지금 무슨 생각을 하고 있나요?"
          value={content}
          onChange={e => setContent(e.target.value)}
          autoFocus
        />

        {/* ── 이미지 미리보기 ── */}
        {images.length > 0 && (
          <div style={s.imageRow}>
            {images.map((img, idx) => (
              <div key={idx} style={s.imgThumb}>
                <img src={img.url} alt="" style={s.imgThumbImg} />
                <button style={s.imgRemoveBtn} onClick={() => removeImage(idx)}>
                  <IoClose size={14} color="#fff" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 하단 툴바 ── */}
      <div style={s.bottomBar}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <button
          style={{ ...s.toolBtn, opacity: uploading ? 0.5 : 1 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="이미지 첨부"
        >
          <IoImageOutline size={24} color={accentColor} />
          <span style={{ ...s.toolLabel, color: accentColor }}>
            {uploading ? '업로드 중...' : '이미지'}
          </span>
        </button>
        <span style={s.charCount}>{content.length > 0 ? `${content.length}자` : ''}</span>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: N.white,
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', borderBottom: `1px solid ${N.gray100}`, flexShrink: 0,
  },
  cancelBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 15, color: N.gray500, fontFamily: 'BMHANNAPro, sans-serif', padding: '4px 0',
  },
  topTitle: {
    fontSize: 16, fontWeight: 700, color: N.gray700, fontFamily: 'BMJUA, sans-serif',
  },
  postBtn: {
    border: 'none', borderRadius: 20, padding: '7px 18px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'BMJUA, sans-serif', transition: 'background 0.2s',
  },
  body: {
    flex: 1, overflowY: 'auto', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  textarea: {
    width: '100%', minHeight: 160, border: 'none', outline: 'none', resize: 'none',
    fontSize: 16, lineHeight: 1.7, color: N.gray700,
    fontFamily: 'BMHANNAPro, sans-serif', backgroundColor: 'transparent',
    boxSizing: 'border-box',
  },
  imageRow: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
  },
  imgThumb: {
    position: 'relative', width: 88, height: 88, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
  },
  imgThumbImg: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },
  imgRemoveBtn: {
    position: 'absolute', top: 4, right: 4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  },
  bottomBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', borderTop: `1px solid ${N.gray100}`,
    backgroundColor: N.white, flexShrink: 0,
  },
  toolBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px',
  },
  toolLabel: {
    fontSize: 14, fontFamily: 'BMJUA, sans-serif',
  },
  charCount: {
    fontSize: 12, color: N.gray300,
  },
};

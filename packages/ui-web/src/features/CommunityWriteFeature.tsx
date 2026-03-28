import { useState, useRef, type CSSProperties, type ChangeEvent } from 'react';
import { IoImageOutline, IoClose } from 'react-icons/io5';

const N = {
  gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray300: '#d1d5db', gray400: '#9ca3af', gray500: '#6b7280',
  gray700: '#374151', white: '#ffffff',
};

export interface CommunityWriteFeatureProps {
  accentColor: string;
  onSubmit: (data: { content: string; imageUrls: string[] }) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

export function CommunityWriteFeature({ accentColor, onSubmit, onUploadImage }: CommunityWriteFeatureProps) {
  const [content, setContent]       = useState('');
  const [images, setImages]         = useState<{ url: string }[]>([]);
  const [uploading, setUploading]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canPost = content.trim().length > 0 && !submitting && !uploading;

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = '';
    if (onUploadImage) {
      setUploading(true);
      try {
        const urls = await Promise.all(files.map(f => onUploadImage(f)));
        setImages(prev => [...prev, ...urls.map(url => ({ url }))]);
      } catch {
        alert('이미지 업로드에 실패했습니다.');
      } finally {
        setUploading(false);
      }
    } else {
      setImages(prev => [...prev, ...files.map(f => ({ url: URL.createObjectURL(f) }))]);
    }
  }

  async function handleSubmit() {
    if (!canPost) return;
    setSubmitting(true);
    try {
      await onSubmit({ content: content.trim(), imageUrls: images.map(i => i.url) });
    } catch {
      alert('게시에 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
    }
  }

  return (
    <div style={s.page}>
      {/* ── 본문 ── */}
      <div style={s.body}>
        <textarea
          style={s.textarea}
          placeholder="지금 무슨 생각을 하고 있나요?"
          value={content}
          onChange={e => setContent(e.target.value)}
          autoFocus
        />
        {images.length > 0 && (
          <div style={s.imageRow}>
            {images.map((img, i) => (
              <div key={i} style={s.thumb}>
                <img src={img.url} alt="" style={s.thumbImg} />
                <button style={s.removeBtn} onClick={() => setImages(p => p.filter((_, j) => j !== i))}>
                  <IoClose size={14} color="#fff" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 하단 툴바 ── */}
      <div style={s.bottomBar}>
        <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageChange} />
        <button
          style={{ ...s.imageBtn, opacity: uploading ? 0.5 : 1 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="이미지 첨부"
        >
          <IoImageOutline size={22} color={accentColor} />
          <span style={{ ...s.imageBtnLabel, color: accentColor }}>
            {uploading ? '업로드 중...' : '이미지'}
          </span>
        </button>
        <button
          style={{ ...s.postBtn, backgroundColor: canPost ? accentColor : N.gray200, color: canPost ? '#fff' : N.gray400 }}
          onClick={handleSubmit}
          disabled={!canPost}
        >
          {submitting ? '게시 중...' : '게시하기'}
        </button>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page:     { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: N.white },
  body:     { flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  textarea: {
    width: '100%', minHeight: 180, border: 'none', outline: 'none', resize: 'none',
    fontSize: 16, lineHeight: 1.7, color: N.gray700,
    fontFamily: 'BMHANNAPro, sans-serif', backgroundColor: 'transparent', boxSizing: 'border-box',
  },
  imageRow:  { display: 'flex', flexWrap: 'wrap', gap: 8 },
  thumb:     { position: 'relative', width: 88, height: 88, borderRadius: 10, overflow: 'hidden', flexShrink: 0 },
  thumbImg:  { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  removeBtn: {
    position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  },
  bottomBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', borderTop: `1px solid ${N.gray100}`, backgroundColor: N.white, flexShrink: 0,
  },
  imageBtn:      { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px' },
  imageBtnLabel: { fontSize: 14, fontFamily: 'BMJUA, sans-serif' },
  postBtn: {
    border: 'none', borderRadius: 20, padding: '8px 20px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'BMJUA, sans-serif', transition: 'background 0.2s',
  },
};

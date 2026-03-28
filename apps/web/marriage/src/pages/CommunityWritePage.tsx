import { useNavigate } from 'react-router-dom';
import { CommunityWriteFeature } from '@we/ui-web';
import { uploadFile } from '../api/storage.api';

async function uploadImage(file: File): Promise<string> {
  return uploadFile(file, 'marriage/community', Date.now().toString());
}

export function CommunityWritePage() {
  const navigate = useNavigate();

  async function handleSubmit(_data: { content: string; imageUrls: string[] }) {
    // TODO: 결혼 커뮤니티 백엔드 연동
    navigate('/community', { replace: true });
  }

  return (
    <CommunityWriteFeature
      accentColor="#c9a96e"
      onSubmit={handleSubmit}
      onUploadImage={uploadImage}
    />
  );
}

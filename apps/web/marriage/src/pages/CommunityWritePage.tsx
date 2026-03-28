import { useNavigate } from 'react-router-dom';
import { CommunityWriteFeature } from '@we/ui-web';
import { getPresignedUploadUrl, getPublicUrl } from '../api/storage.api';

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const { data: presigned } = await getPresignedUploadUrl({
    folder: 'marriage/community',
    resourceId: Date.now().toString(),
    fileName: `image.${ext}`,
  });
  await fetch(presigned.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
  const { data } = await getPublicUrl(presigned.path);
  return data.publicUrl;
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

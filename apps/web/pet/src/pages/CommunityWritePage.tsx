import { useNavigate } from 'react-router-dom';
import { CommunityWriteFeature } from '@we/ui-web';
import { getPresignedUploadUrl, getPublicUrl } from '../api/storage.api';
import { createPost } from '../api/community.api';

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const { data: presigned } = await getPresignedUploadUrl({
    folder: 'pet/community',
    resourceId: Date.now().toString(),
    fileName: `image.${ext}`,
  });
  await fetch(presigned.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
  const { data } = await getPublicUrl(presigned.path);
  return data.publicUrl;
}

export function CommunityWritePage() {
  const navigate = useNavigate();

  async function handleSubmit({ content, imageUrls }: { content: string; imageUrls: string[] }) {
    await createPost({ title: '', content, imageUrls });
    navigate('/community', { replace: true });
  }

  return (
    <CommunityWriteFeature
      accentColor="#97A4D9"
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      onUploadImage={uploadImage}
    />
  );
}

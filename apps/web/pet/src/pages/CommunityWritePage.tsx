import { useNavigate } from 'react-router-dom';
import { CommunityWriteFeature } from '@we/ui-web';
import { uploadFile } from '../api/storage.api';
import { createPost } from '../api/community.api';

async function uploadImage(file: File): Promise<string> {
  return uploadFile(file, 'pet/community', Date.now().toString());
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
      onUploadImage={uploadImage}
    />
  );
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IsString } from 'class-validator';

export enum StorageFolder {
  SHARED_AVATAR = 'shared/avatars',
  COUPLE_DIARY = 'couple/diary',
  COUPLE_COMMUNITY = 'couple/community',
  PET_AVATAR = 'pet/avatars',
  PET_DIARY = 'pet/diary',
  PET_COMMUNITY = 'pet/community',
  MARRIAGE_DIARY = 'marriage/diary',
}

export class PresignedUploadRequestDto {
  @IsString() folder: string;
  @IsString() resourceId: string;
  @IsString() fileName: string;
}

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly expirySeconds: number;

  constructor(private readonly config: ConfigService) {
    this.bucket = config.get('SUPABASE_BUCKET', 'media');
    this.publicUrl = config.get('SUPABASE_PUBLIC_URL', '');
    this.expirySeconds = config.get<number>('SUPABASE_SIGNED_URL_EXPIRY_SECONDS', 3600);

    this.s3 = new S3Client({
      region: config.get('SUPABASE_REGION', 'ap-northeast-2'),
      endpoint: config.get('SUPABASE_S3_URL', ''),
      credentials: {
        accessKeyId: config.get('SUPABASE_ACCESS_KEY', ''),
        secretAccessKey: config.get('SUPABASE_SECRET_KEY', ''),
      },
      forcePathStyle: true,
    });
  }

  async generateUploadUrl(dto: PresignedUploadRequestDto) {
    const sanitized = dto.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${dto.folder}/${dto.resourceId}/${sanitized}`;
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: path });
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: this.expirySeconds });
    return { uploadUrl, path, expiresIn: this.expirySeconds };
  }

  getPublicUrl(path: string) {
    return { publicUrl: `${this.publicUrl}/${this.bucket}/${path}` };
  }

  async getSignedViewUrl(path: string) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: path });
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: this.expirySeconds });
    const expiresAt = new Date(Date.now() + this.expirySeconds * 1000).toISOString();
    return { signedUrl, expiresAt };
  }
}

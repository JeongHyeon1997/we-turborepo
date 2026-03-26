import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SocialClient, SocialUserInfo } from './social-client.interface';

@Injectable()
export class GoogleSocialClient implements SocialClient {
  readonly provider = 'GOOGLE';

  async getUserInfo(accessToken: string): Promise<SocialUserInfo> {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => { throw new Error('Google OAuth 실패'); });

    return {
      providerId: data.id,
      email: data.email,
      nickname: data.name ?? data.email?.split('@')[0] ?? 'User',
      profileImageUrl: data.picture,
    };
  }
}

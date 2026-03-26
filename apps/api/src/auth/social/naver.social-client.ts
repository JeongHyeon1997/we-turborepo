import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SocialClient, SocialUserInfo } from './social-client.interface';

@Injectable()
export class NaverSocialClient implements SocialClient {
  readonly provider = 'NAVER';

  async getUserInfo(accessToken: string): Promise<SocialUserInfo> {
    const { data } = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => { throw new Error('Naver OAuth 실패'); });

    const profile = data.response;
    return {
      providerId: profile.id,
      email: profile.email,
      nickname: profile.name ?? profile.nickname ?? 'User',
      profileImageUrl: profile.profile_image,
    };
  }
}

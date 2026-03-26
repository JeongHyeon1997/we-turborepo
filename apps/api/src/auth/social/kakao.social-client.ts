import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SocialClient, SocialUserInfo } from './social-client.interface';

@Injectable()
export class KakaoSocialClient implements SocialClient {
  readonly provider = 'KAKAO';

  async getUserInfo(accessToken: string): Promise<SocialUserInfo> {
    const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => { throw new Error('Kakao OAuth 실패'); });

    const profile = data.kakao_account?.profile;
    return {
      providerId: String(data.id),
      email: data.kakao_account?.email,
      nickname: profile?.nickname ?? 'User',
      profileImageUrl: profile?.profile_image_url,
    };
  }
}

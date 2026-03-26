export interface SocialUserInfo {
  providerId: string;
  email?: string;
  nickname: string;
  profileImageUrl?: string;
}

export interface SocialClient {
  provider: string;
  getUserInfo(accessToken: string): Promise<SocialUserInfo>;
}

export const SOCIAL_CLIENTS = 'SOCIAL_CLIENTS';

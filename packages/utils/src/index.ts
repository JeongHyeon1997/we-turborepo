export { default as coupleColors } from './colors/couple';
export { default as petColors } from './colors/pet';
export { default as marriageColors } from './colors/marriage';
export type { AppTheme } from './theme';
export { createApi } from './lib/createApi';
export { createAxiosClient } from './lib/createAxiosClient';
export { createAuthStore } from './stores/authStore';
export type { AuthState } from './stores/authStore';
export { createDiaryStore } from './stores/diaryStore';
export { createDiaryRepo } from './stores/diaryRepo';
export { fonts } from './fonts';
export type { CommunityPost } from './community';
export type { DiaryEntry, Mood } from './diary';
export type { Announcement } from './announcement';
export type { CouplePartner, CoupleConnection } from './couple';
export type { FamilyMember, FamilyGroup } from './family';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(value);
};

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
export type { AuthUser } from './auth';

export type * from './types';

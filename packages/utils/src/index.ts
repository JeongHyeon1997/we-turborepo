export { default as coupleColors } from './colors/couple';
export { default as petColors } from './colors/pet';
export type { AppTheme } from './theme';
export { createApi } from './lib/createApi';
export { fonts } from './fonts';
export type { CommunityPost } from './community';
export type { DiaryEntry, Mood } from './diary';
export type { Announcement } from './announcement';
export type { CouplePartner, CoupleConnection } from './couple';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(value);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

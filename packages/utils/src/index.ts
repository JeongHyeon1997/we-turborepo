export { default as coupleColors } from './colors/couple';
export { default as petColors } from './colors/pet';
export type { AppTheme } from './theme';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(value);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

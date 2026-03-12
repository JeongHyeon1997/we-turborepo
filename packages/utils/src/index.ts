export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(value);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

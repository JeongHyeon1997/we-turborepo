export interface CouplePartner {
  id: string;
  name: string;
  avatarColor: string;
}

export interface CoupleConnection {
  partner: CouplePartner;
  /** 연애 시작일 'YYYY-MM-DD' */
  datingStartDate: string;
  /** 일기 공유 시작일 'YYYY-MM-DD' */
  shareStartDate: string;
}

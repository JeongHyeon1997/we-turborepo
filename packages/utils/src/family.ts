export interface FamilyMember {
  id: string;
  name: string;
  avatarColor: string;
}

export interface FamilyGroup {
  /** 나를 제외한 가족 구성원 목록 */
  members: FamilyMember[];
  /** 'YYYY-MM-DD' — 가족 그룹 시작일 */
  groupStartDate: string;
}

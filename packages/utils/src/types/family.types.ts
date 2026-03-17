import type { Timestamps } from './common.types';

// ─── Base (DB Table: family_groups) ──────────────────────────────────────────

export interface FamilyGroupBase extends Timestamps {
  id: string;
  /** 그룹 시작일 'YYYY-MM-DD' */
  groupStartDate: string;
  inviteCode: string;
}

// ─── Base (DB Table: family_members) ─────────────────────────────────────────

export interface FamilyMemberBase extends Timestamps {
  id: string;
  groupId: string;
  userId: string;
  name: string;
  avatarColor: string;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/** GET /family 응답 */
export interface FamilyGroupResponse extends FamilyGroupBase {
  /** 나를 제외한 구성원 목록 */
  members: FamilyMemberBase[];
}

// ─── Write ────────────────────────────────────────────────────────────────────

// POST /family (그룹 생성) → FamilyGroupResponse

/** POST /family/join 요청 */
export interface JoinFamilyRequest {
  inviteCode: string;
}

/** POST /family/join 응답 */
export type JoinFamilyResponse = FamilyGroupResponse;

// DELETE /family/members/:memberId → 204 No Content
// DELETE /family → 204 No Content (나가기 / 그룹 해체)

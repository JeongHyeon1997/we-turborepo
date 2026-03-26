// ─── Family Group ─────────────────────────────────────────────────────────────

export interface FamilyMemberInfo {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string;
}

export interface FamilyGroupResponse {
  id: string;
  name: string;
  members: FamilyMemberInfo[];
}

/** POST /api/pet/family 요청 (그룹 생성) */
export interface CreateFamilyRequest {
  name: string;
}

/** POST /api/pet/family/invite 응답 */
export interface InviteFamilyResponse {
  inviteCode: string;
  expiresAt: string;
}

/** POST /api/pet/family/join 요청 */
export interface JoinFamilyRequest {
  inviteCode: string;
}

/** POST /api/pet/family/join 응답 */
export type JoinFamilyResponse = FamilyGroupResponse;

// DELETE /api/pet/family → 204 No Content (탈퇴)
// DELETE /api/pet/family/members/:memberId → 204 No Content (강퇴, OWNER 전용)


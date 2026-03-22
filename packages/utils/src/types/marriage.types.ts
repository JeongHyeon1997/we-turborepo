// ─── Marriage Connection ───────────────────────────────────────────────────────

export interface MarriagePartnerInfo {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
}

export interface MarriageConnectionResponse {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'DISCONNECTED';
  partner: MarriagePartnerInfo;
  /** 결혼기념일 'yyyy-MM-dd' */
  weddingDate: string | null;
  /** 일기 공유 시작일 'yyyy-MM-dd' */
  shareStartDate: string | null;
  /** 연결 시각 (ISO 8601) */
  connectedAt: string | null;
}

/** GET /api/marriage 응답 */
export type MarriageResponse = MarriageConnectionResponse;

// ─── Invite ───────────────────────────────────────────────────────────────────

/** POST /api/marriage/request 응답 (초대코드 발급) */
export interface CreateMarriageInviteResponse {
  inviteCode: string;
  expiresAt: string;
}

/** POST /api/marriage/confirm 요청 */
export interface ConfirmMarriageRequest {
  inviteCode: string;
}

/** POST /api/marriage/confirm 응답 */
export type ConfirmMarriageResponse = MarriageConnectionResponse;

// ─── Update ───────────────────────────────────────────────────────────────────

/** PUT /api/marriage 요청 */
export interface UpdateMarriageRequest {
  weddingDate?: string | null;
  shareStartDate?: string | null;
}

/** PUT /api/marriage 응답 */
export type UpdateMarriageResponse = MarriageConnectionResponse;

// DELETE /api/marriage → 204 No Content

// ─── Base (DB Table: marriage_connections) ────────────────────────────────────

export interface MarriageConnectionBase {
  id: string;
  user1Id: string;
  user2Id: string;
  status: 'PENDING' | 'ACTIVE' | 'DISCONNECTED';
  weddingDate: string | null;
  shareStartDate: string | null;
  connectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Base (DB Table: marriage_invites) ────────────────────────────────────────

export interface MarriageInviteBase {
  id: string;
  inviterId: string;
  inviteCode: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Couple Connection ────────────────────────────────────────────────────────

export interface CouplePartnerInfo {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
}

export interface CoupleConnectionResponse {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'DISCONNECTED';
  partner: CouplePartnerInfo;
  /** 커플 별명 */
  coupleName: string | null;
  /** 기념일 'yyyy-MM-dd' */
  anniversaryDate: string | null;
  /** 연결 시각 (ISO 8601) */
  connectedAt: string | null;
}

/** GET /api/couple 응답 */
export type CoupleResponse = CoupleConnectionResponse;

// ─── Invite ───────────────────────────────────────────────────────────────────

/** POST /api/couple/request 응답 (초대 코드 발급) */
export interface CreateInviteResponse {
  inviteCode: string;
  expiresAt: string;
}

/** POST /api/couple/confirm 요청 */
export interface ConfirmCoupleRequest {
  inviteCode: string;
}

/** POST /api/couple/confirm 응답 */
export type ConfirmCoupleResponse = CoupleConnectionResponse;

// ─── Update ───────────────────────────────────────────────────────────────────

/** PUT /api/couple 요청 */
export interface UpdateCoupleRequest {
  coupleName?: string | null;
  anniversaryDate?: string | null;
}

/** PUT /api/couple 응답 */
export type UpdateCoupleResponse = CoupleConnectionResponse;

// DELETE /api/couple → 204 No Content


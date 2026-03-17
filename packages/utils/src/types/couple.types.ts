import type { Timestamps } from './common.types';

// ─── Base (DB Table: couple_connections) ─────────────────────────────────────

export interface CoupleConnectionBase extends Timestamps {
  id: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatarColor: string;
  /** 연애 시작일 'YYYY-MM-DD' */
  datingStartDate: string;
  /** 일기 공유 시작일 'YYYY-MM-DD' */
  shareStartDate: string;
  status: 'pending' | 'connected';
}

// ─── Base (DB Table: couple_invites) ─────────────────────────────────────────

export interface CoupleInviteBase extends Timestamps {
  id: string;
  inviterId: string;
  inviteCode: string;
  expiresAt: string;
  usedAt: string | null;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/** GET /couple 응답 */
export type CoupleResponse = CoupleConnectionBase;

// ─── Write ────────────────────────────────────────────────────────────────────

/** POST /couple/request 응답 (초대코드 발급) */
export interface CreateInviteResponse {
  inviteCode: string;
  expiresAt: string;
}

/** POST /couple/confirm 요청 */
export interface ConfirmCoupleRequest {
  inviteCode: string;
  /** 연애 시작일 'YYYY-MM-DD' */
  datingStartDate: string;
}

/** POST /couple/confirm 응답 */
export type ConfirmCoupleResponse = CoupleConnectionBase;

/** PUT /couple 요청 */
export interface UpdateCoupleRequest {
  datingStartDate?: string;
  shareStartDate?: string;
}

/** PUT /couple 응답 */
export type UpdateCoupleResponse = CoupleConnectionBase;

// DELETE /couple → 204 No Content

import { $axios } from '../lib/$axios';
import type {
  CoupleResponse,
  CreateInviteResponse,
  ConfirmCoupleRequest,
  ConfirmCoupleResponse,
  UpdateCoupleRequest,
  UpdateCoupleResponse,
} from '@we/utils';

/** GET /api/couple 🔒 — 내 커플 정보 조회 */
export const getCouple = () =>
  $axios.get<CoupleResponse>('/api/couple');

/** POST /api/couple/request 🔒 — 초대 코드 생성 */
export const requestCoupleInvite = () =>
  $axios.post<CreateInviteResponse>('/api/couple/request');

/** POST /api/couple/confirm 🔒 — 초대 코드로 커플 연결 */
export const confirmCouple = (req: ConfirmCoupleRequest) =>
  $axios.post<ConfirmCoupleResponse>('/api/couple/confirm', req);

/** PUT /api/couple 🔒 — 커플 정보 수정 */
export const updateCouple = (req: UpdateCoupleRequest) =>
  $axios.put<UpdateCoupleResponse>('/api/couple', req);

/** DELETE /api/couple 🔒 — 커플 연결 해제 */
export const deleteCouple = () =>
  $axios.delete<void>('/api/couple');

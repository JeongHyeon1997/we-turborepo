import { $axios } from '../lib/$axios';
import type {
  CoupleResponse,
  CreateInviteResponse,
  ConfirmCoupleRequest,
  ConfirmCoupleResponse,
  UpdateCoupleRequest,
  UpdateCoupleResponse,
} from '@we/utils';

/** GET /api/marriage 🔒 — 배우자 정보 조회 */
export const getMarriage = () =>
  $axios.get<CoupleResponse>('/api/marriage');

/** POST /api/marriage/request 🔒 — 초대 코드 생성 */
export const requestMarriageInvite = () =>
  $axios.post<CreateInviteResponse>('/api/marriage/request');

/** POST /api/marriage/confirm 🔒 — 초대 코드로 배우자 연결 */
export const confirmMarriage = (req: ConfirmCoupleRequest) =>
  $axios.post<ConfirmCoupleResponse>('/api/marriage/confirm', req);

/** PUT /api/marriage 🔒 — 배우자 정보 수정 */
export const updateMarriage = (req: UpdateCoupleRequest) =>
  $axios.put<UpdateCoupleResponse>('/api/marriage', req);

/** DELETE /api/marriage 🔒 — 배우자 연결 해제 */
export const deleteMarriage = () =>
  $axios.delete<void>('/api/marriage');

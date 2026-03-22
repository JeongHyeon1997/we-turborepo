import { $axios } from '../lib/$axios';
import type {
  MarriageResponse,
  CreateMarriageInviteResponse,
  ConfirmMarriageRequest,
  ConfirmMarriageResponse,
  UpdateMarriageRequest,
  UpdateMarriageResponse,
} from '@we/utils';

/** GET /api/marriage 🔒 */
export const getMarriage = () =>
  $axios.get<MarriageResponse>('/api/marriage');

/** POST /api/marriage/request 🔒 */
export const requestMarriageInvite = () =>
  $axios.post<CreateMarriageInviteResponse>('/api/marriage/request');

/** POST /api/marriage/confirm 🔒 */
export const confirmMarriage = (req: ConfirmMarriageRequest) =>
  $axios.post<ConfirmMarriageResponse>('/api/marriage/confirm', req);

/** PUT /api/marriage 🔒 */
export const updateMarriage = (req: UpdateMarriageRequest) =>
  $axios.put<UpdateMarriageResponse>('/api/marriage', req);

/** DELETE /api/marriage 🔒 */
export const deleteMarriage = () =>
  $axios.delete<void>('/api/marriage');

import { $axios } from '../lib/$axios';
import type {
  FamilyGroupResponse,
  CreateFamilyRequest,
  InviteFamilyResponse,
  JoinFamilyRequest,
  JoinFamilyResponse,
} from '@we/utils';

/** GET /api/pet/family 🔒 — 내 그룹 조회 */
export const getFamily = () =>
  $axios.get<FamilyGroupResponse>('/api/pet/family');

/** POST /api/pet/family 🔒 — 그룹 생성 */
export const createFamily = (req: CreateFamilyRequest) =>
  $axios.post<FamilyGroupResponse>('/api/pet/family', req);

/** POST /api/pet/family/invite 🔒 — 초대 코드 생성 */
export const inviteFamily = () =>
  $axios.post<InviteFamilyResponse>('/api/pet/family/invite');

/** POST /api/pet/family/join 🔒 — 초대 코드로 참여 */
export const joinFamily = (req: JoinFamilyRequest) =>
  $axios.post<JoinFamilyResponse>('/api/pet/family/join', req);

/** DELETE /api/pet/family 🔒 — 그룹 탈퇴 */
export const leaveFamily = () =>
  $axios.delete<void>('/api/pet/family');

/** DELETE /api/pet/family/members/:memberId 🔒 — 멤버 강퇴 (OWNER 전용) */
export const kickMember = (memberId: string) =>
  $axios.delete<void>(`/api/pet/family/members/${memberId}`);

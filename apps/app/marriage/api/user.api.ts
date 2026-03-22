import { $axios } from '../lib/$axios';
import type { UserBase } from '@we/utils';

/** GET /api/user/me 🔒 */
export const getMe = () =>
  $axios.get<UserBase>('/api/user/me');

/** PUT /api/user/me 🔒 */
export const updateMe = (req: Partial<Pick<UserBase, 'name'>>) =>
  $axios.put<UserBase>('/api/user/me', req);

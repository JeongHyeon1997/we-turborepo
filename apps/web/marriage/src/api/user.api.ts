import { $axios } from '../lib/$axios';
import type { UserResponse, UpdateUserRequest, UpdateUserResponse } from '@we/utils';

/** GET /api/user/me 🔒 */
export const getMe = () =>
  $axios.get<UserResponse>('/api/user/me');

/** PUT /api/user/me 🔒 */
export const updateMe = (req: UpdateUserRequest) =>
  $axios.put<UpdateUserResponse>('/api/user/me', req);

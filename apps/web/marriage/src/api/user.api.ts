import { $axios } from '../lib/$axios';
import type { UserResponse, UpdateUserRequest, UpdateUserResponse } from '@we/utils';

/** GET /api/users/me 🔒 */
export const getMe = () =>
  $axios.get<UserResponse>('/api/users/me');

/** PUT /api/users/me 🔒 */
export const updateMe = (req: UpdateUserRequest) =>
  $axios.put<UpdateUserResponse>('/api/users/me', req);

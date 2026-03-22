import { $axios } from '../lib/$axios';
import type {
  CommunityListQuery,
  CommunityListResponse,
  CommunityDetailResponse,
  CreatePostRequest,
  CreatePostResponse,
} from '@we/utils';

/** GET /api/community */
export const getCommunityList = (query: CommunityListQuery) =>
  $axios.get<CommunityListResponse>('/api/community', { params: query });

/** GET /api/community/:id */
export const getCommunityPost = (id: string) =>
  $axios.get<CommunityDetailResponse>(`/api/community/${id}`);

/** POST /api/community 🔒 */
export const createCommunityPost = (req: CreatePostRequest) =>
  $axios.post<CreatePostResponse>('/api/community', req);

/** DELETE /api/community/:id 🔒 */
export const deleteCommunityPost = (id: string) =>
  $axios.delete<void>(`/api/community/${id}`);

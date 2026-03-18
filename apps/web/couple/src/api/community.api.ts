import { $axios } from '../lib/$axios';
import type {
  CommunityListQuery,
  CommunityListResponse,
  CommunityDetailResponse,
  CreatePostRequest,
  CreatePostResponse,
  LikeResponse,
  CommentListQuery,
  CommentListResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  CreateReportRequest,
} from '@we/utils';

const BASE = '/api/couple/community/posts';

/** GET /api/couple/community/posts 🔒 */
export const getPosts = (query: CommunityListQuery) =>
  $axios.get<CommunityListResponse>(BASE, { params: query });

/** GET /api/couple/community/posts/:id 🔒 */
export const getPost = (id: string) =>
  $axios.get<CommunityDetailResponse>(`${BASE}/${id}`);

/** POST /api/couple/community/posts 🔒 */
export const createPost = (req: CreatePostRequest) =>
  $axios.post<CreatePostResponse>(BASE, req);

/** DELETE /api/couple/community/posts/:id 🔒 */
export const deletePost = (id: string) =>
  $axios.delete<void>(`${BASE}/${id}`);

/** POST /api/couple/community/posts/:id/like 🔒 */
export const toggleLike = (id: string) =>
  $axios.post<LikeResponse>(`${BASE}/${id}/like`);

/** GET /api/couple/community/posts/:id/comments 🔒 */
export const getComments = (id: string, query: CommentListQuery) =>
  $axios.get<CommentListResponse>(`${BASE}/${id}/comments`, { params: query });

/** POST /api/couple/community/posts/:id/comments 🔒 */
export const createComment = (id: string, req: CreateCommentRequest) =>
  $axios.post<CreateCommentResponse>(`${BASE}/${id}/comments`, req);

/** DELETE /api/couple/community/posts/:id/comments/:commentId 🔒 */
export const deleteComment = (postId: string, commentId: string) =>
  $axios.delete<void>(`${BASE}/${postId}/comments/${commentId}`);

/** POST /api/couple/community/posts/:id/report 🔒 */
export const reportPost = (id: string, req: CreateReportRequest) =>
  $axios.post<void>(`${BASE}/${id}/report`, req);

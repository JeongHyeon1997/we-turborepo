import type { PaginationQuery, PageResult } from './common.types';

// ─── Post ─────────────────────────────────────────────────────────────────────

export interface CommunityPostBase {
  id: string;
  authorId: string;
  authorNickname: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  category: string | null;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  createdAt: string;
}

// ─── Comment ──────────────────────────────────────────────────────────────────

export interface CommunityCommentBase {
  id: string;
  authorId: string;
  authorNickname: string;
  content: string;
  createdAt: string;
}

// ─── Report ───────────────────────────────────────────────────────────────────

export type ReportReason = 'spam' | 'obscene' | 'harassment' | 'other';

export interface CommunityReportBase {
  id: string;
  postId: string;
  reporterId: string;
  reason: ReportReason;
  detail: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Post Read ────────────────────────────────────────────────────────────────

/** GET /community/posts 쿼리 */
export interface CommunityListQuery extends PaginationQuery {
  category?: string;
}

/** GET /community/posts 응답 */
export type CommunityListResponse = PageResult<CommunityPostBase>;

/** GET /community/posts/:id 응답 */
export type CommunityDetailResponse = CommunityPostBase;

// ─── Post Write ───────────────────────────────────────────────────────────────

/** POST /community/posts 요청 */
export interface CreatePostRequest {
  title: string;
  content: string;
  category?: string | null;
}

/** POST /community/posts 응답 */
export type CreatePostResponse = CommunityPostBase;

// DELETE /community/posts/:id → 204 No Content

// ─── Like ─────────────────────────────────────────────────────────────────────

/** POST /community/posts/:id/like 응답 */
export interface LikeResponse {
  isLiked: boolean;
  likeCount: number;
}

// ─── Comment Read ─────────────────────────────────────────────────────────────

/** GET /community/posts/:id/comments 쿼리 */
export type CommentListQuery = PaginationQuery;

/** GET /community/posts/:id/comments 응답 */
export type CommentListResponse = PageResult<CommunityCommentBase>;

// ─── Comment Write ────────────────────────────────────────────────────────────

/** POST /community/posts/:id/comments 요청 */
export interface CreateCommentRequest {
  content: string;
}

/** POST /community/posts/:id/comments 응답 */
export type CreateCommentResponse = CommunityCommentBase;

// DELETE /community/posts/:id/comments/:commentId → 204 No Content

// ─── Report ───────────────────────────────────────────────────────────────────

/** POST /community/posts/:id/report 요청 */
export interface CreateReportRequest {
  reason: string;
}

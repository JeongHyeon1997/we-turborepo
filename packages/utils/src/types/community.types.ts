import type { Timestamps, PaginationQuery, PageResult } from './common.types';

// ─── Base (DB Table: community_posts) ────────────────────────────────────────

export interface CommunityPostBase extends Timestamps {
  id: string;
  userId: string;
  authorName: string;
  authorAvatarColor: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
}

// ─── Base (DB Table: community_comments) ─────────────────────────────────────

export interface CommunityCommentBase extends Timestamps {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorAvatarColor: string;
  content: string;
}

// ─── Base (DB Table: community_reports) ──────────────────────────────────────

export type ReportReason = 'spam' | 'obscene' | 'harassment' | 'other';

export interface CommunityReportBase extends Timestamps {
  id: string;
  postId: string;
  reporterId: string;
  reason: ReportReason;
  detail: string | null;
}

// ─── Post Read ────────────────────────────────────────────────────────────────

/** GET /community/posts 쿼리 */
export type CommunityListQuery = PaginationQuery;

/** GET /community/posts 응답 (로그인 시 isLiked 포함) */
export interface CommunityListResponse extends PageResult<CommunityPostBase> {
  items: (CommunityPostBase & { isLiked?: boolean })[];
}

/** GET /community/posts/:id 응답 */
export type CommunityDetailResponse = CommunityPostBase & { isLiked?: boolean };

// ─── Post Write ───────────────────────────────────────────────────────────────

/** POST /community/posts 요청 */
export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
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
export type CreateReportRequest = Pick<CommunityReportBase, 'reason' | 'detail'>;

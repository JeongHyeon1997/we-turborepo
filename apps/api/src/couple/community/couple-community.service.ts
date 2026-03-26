import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, CreateCommentDto, CreateReportDto } from './dto/community.dto';
import { PageResponse } from '../../common/dto/page-response.dto';

@Injectable()
export class CoupleCommunityService {
  constructor(private readonly prisma: PrismaService) {}

  async getPostList(userId: string, category: string | undefined, page: number, size: number): Promise<PageResponse<any>> {
    const where = category ? { category } : {};
    const skip = page * size;
    const [posts, total] = await Promise.all([
      this.prisma.coupleCommunityPost.findMany({
        where,
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: size,
      }),
      this.prisma.coupleCommunityPost.count({ where }),
    ]);
    const likedSet = await this.prisma.coupleCommunityLike.findMany({
      where: { userId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    });
    const likedIds = new Set(likedSet.map((l) => l.postId));
    return PageResponse.of(posts.map((p) => ({ ...p, liked: likedIds.has(p.id) })), total, page, size);
  }

  async getPost(userId: string, id: string) {
    const post = await this.prisma.coupleCommunityPost.findUnique({ where: { id }, include: { author: true } });
    if (!post) throw new BadRequestException('게시글을 찾을 수 없습니다');
    const liked = !!(await this.prisma.coupleCommunityLike.findUnique({ where: { postId_userId: { postId: id, userId } } }));
    return { ...post, liked };
  }

  async createPost(userId: string, dto: CreatePostDto) {
    return this.prisma.coupleCommunityPost.create({
      data: { authorId: userId, title: dto.title, content: dto.content, category: dto.category },
      include: { author: true },
    });
  }

  async deletePost(userId: string, id: string) {
    const post = await this.prisma.coupleCommunityPost.findUnique({ where: { id } });
    if (!post) throw new BadRequestException('게시글을 찾을 수 없습니다');
    if (post.authorId !== userId) throw new BadRequestException('삭제 권한이 없습니다');
    await this.prisma.coupleCommunityPost.delete({ where: { id } });
  }

  async toggleLike(userId: string, postId: string) {
    const existing = await this.prisma.coupleCommunityLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      await Promise.all([
        this.prisma.coupleCommunityLike.delete({ where: { postId_userId: { postId, userId } } }),
        this.prisma.coupleCommunityPost.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } }),
      ]);
    } else {
      await Promise.all([
        this.prisma.coupleCommunityLike.create({ data: { postId, userId } }),
        this.prisma.coupleCommunityPost.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } }),
      ]);
    }
  }

  async getComments(postId: string, page: number, size: number): Promise<PageResponse<any>> {
    const skip = page * size;
    const [items, total] = await Promise.all([
      this.prisma.coupleCommunityComment.findMany({
        where: { postId },
        include: { author: true },
        orderBy: { createdAt: 'asc' },
        skip,
        take: size,
      }),
      this.prisma.coupleCommunityComment.count({ where: { postId } }),
    ]);
    return PageResponse.of(items, total, page, size);
  }

  async createComment(userId: string, postId: string, dto: CreateCommentDto) {
    const [comment] = await this.prisma.$transaction([
      this.prisma.coupleCommunityComment.create({
        data: { postId, authorId: userId, content: dto.content },
        include: { author: true },
      }),
      this.prisma.coupleCommunityPost.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } }),
    ]);
    return comment;
  }

  async deleteComment(userId: string, postId: string, commentId: string) {
    const comment = await this.prisma.coupleCommunityComment.findUnique({ where: { id: commentId } });
    if (!comment) throw new BadRequestException('댓글을 찾을 수 없습니다');
    if (comment.authorId !== userId) throw new BadRequestException('삭제 권한이 없습니다');
    await Promise.all([
      this.prisma.coupleCommunityComment.delete({ where: { id: commentId } }),
      this.prisma.coupleCommunityPost.update({ where: { id: postId }, data: { commentCount: { decrement: 1 } } }),
    ]);
  }

  async reportPost(userId: string, postId: string, dto: CreateReportDto) {
    const existing = await this.prisma.coupleCommunityReport.findUnique({
      where: { postId_reporterId: { postId, reporterId: userId } },
    });
    if (existing) throw new BadRequestException('이미 신고한 게시글입니다');
    await this.prisma.coupleCommunityReport.create({ data: { postId, reporterId: userId, reason: dto.reason } });
  }
}

import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PetCommunityService, CreatePetPostDto, CreatePetCommentDto, CreatePetReportDto } from './pet-community.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Pet Community')
@ApiBearerAuth()
@Controller('pet/community')
export class PetCommunityController {
  constructor(private readonly communityService: PetCommunityService) {}

  @Get('posts')
  @ApiOperation({ summary: '펫 커뮤니티 게시글 목록' })
  getPostList(@CurrentUser() userId: string, @Query('category') category?: string, @Query('page') page = '0', @Query('size') size = '20') {
    return this.communityService.getPostList(userId, category, Number(page), Number(size));
  }

  @Get('posts/:id')
  @ApiOperation({ summary: '게시글 상세' })
  getPost(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.communityService.getPost(userId, id);
  }

  @Post('posts')
  @ApiOperation({ summary: '게시글 작성' })
  createPost(@CurrentUser() userId: string, @Body() dto: CreatePetPostDto) {
    return this.communityService.createPost(userId, dto);
  }

  @Delete('posts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '게시글 삭제' })
  deletePost(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.communityService.deletePost(userId, id);
  }

  @Post('posts/:id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '좋아요 토글' })
  toggleLike(@CurrentUser() userId: string, @Param('id') postId: string) {
    return this.communityService.toggleLike(userId, postId);
  }

  @Get('posts/:id/comments')
  @ApiOperation({ summary: '댓글 목록' })
  getComments(@Param('id') postId: string, @Query('page') page = '0', @Query('size') size = '20') {
    return this.communityService.getComments(postId, Number(page), Number(size));
  }

  @Post('posts/:id/comments')
  @ApiOperation({ summary: '댓글 작성' })
  createComment(@CurrentUser() userId: string, @Param('id') postId: string, @Body() dto: CreatePetCommentDto) {
    return this.communityService.createComment(userId, postId, dto);
  }

  @Delete('posts/:postId/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '댓글 삭제' })
  deleteComment(@CurrentUser() userId: string, @Param('postId') postId: string, @Param('commentId') commentId: string) {
    return this.communityService.deleteComment(userId, postId, commentId);
  }

  @Post('posts/:id/report')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '게시글 신고' })
  reportPost(@CurrentUser() userId: string, @Param('id') postId: string, @Body() dto: CreatePetReportDto) {
    return this.communityService.reportPost(userId, postId, dto);
  }
}

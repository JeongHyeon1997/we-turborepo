import { Controller, Get, Post, Body, Query, Param, Req, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { StorageService, PresignedUploadRequestDto } from './storage.service';

@ApiTags('Storage')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned-upload-url')
  @ApiOperation({ summary: '업로드 서명 URL 발급' })
  getPresignedUploadUrl(@Body() dto: PresignedUploadRequestDto) {
    return this.storageService.generateUploadUrl(dto);
  }

  @Get('public-url')
  @ApiOperation({ summary: '파일 공개 URL 조회' })
  getPublicUrl(@Query('path') path: string) {
    return this.storageService.getPublicUrl(path);
  }

  @Get('signed-view-url')
  @ApiOperation({ summary: '파일 서명 조회 URL 발급' })
  getSignedViewUrl(@Query('path') path: string) {
    return this.storageService.getSignedViewUrl(path);
  }

  @Get('files/*')
  @ApiOperation({ summary: '파일 조회 (리다이렉트)' })
  async redirectToFile(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const path = (req.url as string).replace('/api/storage/files/', '');
    const { url } = this.storageService.getPublicUrl(path);
    res.status(HttpStatus.FOUND).redirect(url);
  }
}

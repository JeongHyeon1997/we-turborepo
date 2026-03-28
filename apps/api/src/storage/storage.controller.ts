import { Controller, Get, Post, Body, Query, Req, Res, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { StorageService, PresignedUploadRequestDto } from './storage.service';
import { Public } from '../common/decorators/public.decorator';

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

  @Get('signed-view-url')
  @ApiOperation({ summary: '파일 서명 조회 URL 발급' })
  getSignedViewUrl(@Query('path') path: string) {
    return this.storageService.getSignedViewUrl(path);
  }

  /** 이미지 프록시 — Supabase URL을 클라이언트에 노출하지 않고 서버에서 스트리밍 */
  @Public()
  @Get('files/*')
  @ApiOperation({ summary: '파일 프록시 (서버 경유 이미지 제공)' })
  async proxyFile(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const filePath = (req.url as string).replace('/api/storage/files/', '');
    const { publicUrl } = this.storageService.getPublicUrl(filePath);

    const upstream = await fetch(publicUrl);
    if (!upstream.ok) {
      res.status(404).send({ message: '파일을 찾을 수 없습니다' });
      return;
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const buffer = Buffer.from(await upstream.arrayBuffer());

    res
      .header('Content-Type', contentType)
      .header('Cache-Control', 'public, max-age=31536000, immutable')
      .status(200)
      .send(buffer);
  }
}

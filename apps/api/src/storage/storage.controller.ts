import { Controller, Get, Post, Body, Query, Req, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService, PresignedUploadRequestDto } from './storage.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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

  @Post('upload')
  @ApiOperation({ summary: '파일 직접 업로드 (서버 경유)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' }, resourceId: { type: 'string' }, fileName: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
    @Body('resourceId') resourceId: string,
    @Body('fileName') fileName: string,
  ) {
    if (!file) throw new BadRequestException('파일이 없습니다.');
    const name = fileName || file.originalname;
    return this.storageService.uploadFile(folder, resourceId, name, file.buffer, file.mimetype);
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
  async proxyFile(@Req() req: any, @Res() res: any) {
    const filePath = (req.url as string).replace('/api/storage/files/', '');
    const { publicUrl } = this.storageService.getPublicUrl(filePath);

    const upstream = await fetch(publicUrl);
    if (!upstream.ok) {
      res.status(404).json({ message: '파일을 찾을 수 없습니다' });
      return;
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const buffer = Buffer.from(await upstream.arrayBuffer());

    res
      .setHeader('Content-Type', contentType)
      .setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      .status(200)
      .send(buffer);
  }
}

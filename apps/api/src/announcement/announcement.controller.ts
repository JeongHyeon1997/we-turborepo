import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnnouncementService } from './announcement.service';

@ApiTags('Announcement')
@ApiBearerAuth()
@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @ApiOperation({ summary: '공지사항 목록' })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  getList(
    @Query('page') page = '0',
    @Query('size') size = '20',
  ) {
    return this.announcementService.getList(Number(page), Number(size));
  }

  @Get(':id')
  @ApiOperation({ summary: '공지사항 상세' })
  getOne(@Param('id') id: string) {
    return this.announcementService.getOne(id);
  }
}

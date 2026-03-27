import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarriageDiaryService } from './marriage-diary.service';
import { CreateMarriageDiaryDto, UpdateMarriageDiaryDto } from './dto/diary.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Marriage Diary')
@ApiBearerAuth()
@Controller('marriage/diary')
export class MarriageDiaryController {
  constructor(private readonly marriageDiaryService: MarriageDiaryService) {}

  @Get()
  @ApiOperation({ summary: '결혼 다이어리 목록' })
  getList(
    @CurrentUser() userId: string,
    @Query('page') page = '0',
    @Query('size') size = '20',
  ) {
    return this.marriageDiaryService.getList(userId, Number(page), Number(size));
  }

  @Get(':id')
  @ApiOperation({ summary: '결혼 다이어리 상세' })
  getOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.marriageDiaryService.getOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: '결혼 다이어리 작성' })
  create(@CurrentUser() userId: string, @Body() dto: CreateMarriageDiaryDto) {
    return this.marriageDiaryService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '결혼 다이어리 수정' })
  update(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMarriageDiaryDto,
  ) {
    return this.marriageDiaryService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '결혼 다이어리 삭제' })
  delete(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.marriageDiaryService.delete(userId, id);
  }
}

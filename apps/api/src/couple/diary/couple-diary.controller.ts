import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoupleDiaryService } from './couple-diary.service';
import { CreateDiaryDto, UpdateDiaryDto } from './dto/diary.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Couple Diary')
@ApiBearerAuth()
@Controller('couple/diary')
export class CoupleDiaryController {
  constructor(private readonly diaryService: CoupleDiaryService) {}

  @Get()
  @ApiOperation({ summary: '커플 다이어리 목록' })
  getList(@CurrentUser() userId: string, @Query('page') page = '0', @Query('size') size = '20') {
    return this.diaryService.getList(userId, Number(page), Number(size));
  }

  @Get(':id')
  @ApiOperation({ summary: '커플 다이어리 상세' })
  getOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.diaryService.getOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: '커플 다이어리 작성' })
  create(@CurrentUser() userId: string, @Body() dto: CreateDiaryDto) {
    return this.diaryService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '커플 다이어리 수정' })
  update(@CurrentUser() userId: string, @Param('id') id: string, @Body() dto: UpdateDiaryDto) {
    return this.diaryService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '커플 다이어리 삭제' })
  delete(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.diaryService.delete(userId, id);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PetDiaryService, CreatePetDiaryDto, UpdatePetDiaryDto } from './pet-diary.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Pet Diary')
@ApiBearerAuth()
@Controller('pet/diary')
export class PetDiaryController {
  constructor(private readonly diaryService: PetDiaryService) {}

  @Get()
  @ApiOperation({ summary: '펫 다이어리 목록' })
  getList(
    @CurrentUser() userId: string,
    @Query('petId') petId?: string,
    @Query('page') page = '0',
    @Query('size') size = '20',
  ) {
    return this.diaryService.getList(userId, petId, Number(page), Number(size));
  }

  @Get('gallery')
  @ApiOperation({ summary: '펫 갤러리 (이미지 첨부 일기만)' })
  getGallery(@CurrentUser() userId: string, @Query('page') page = '0', @Query('size') size = '30') {
    return this.diaryService.getGallery(userId, Number(page), Number(size));
  }

  @Get(':id')
  @ApiOperation({ summary: '펫 다이어리 상세' })
  getOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.diaryService.getOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: '펫 다이어리 작성' })
  create(@CurrentUser() userId: string, @Body() dto: CreatePetDiaryDto) {
    return this.diaryService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '펫 다이어리 수정' })
  update(@CurrentUser() userId: string, @Param('id') id: string, @Body() dto: UpdatePetDiaryDto) {
    return this.diaryService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '펫 다이어리 삭제' })
  delete(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.diaryService.delete(userId, id);
  }
}

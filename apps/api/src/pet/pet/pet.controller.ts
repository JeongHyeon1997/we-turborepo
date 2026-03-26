import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PetService } from './pet.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Pet')
@ApiBearerAuth()
@Controller('pet/pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get()
  @ApiOperation({ summary: '펫 목록 조회' })
  getList(@CurrentUser() userId: string) {
    return this.petService.getList(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '펫 상세 조회' })
  getOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.petService.getOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: '펫 등록' })
  create(@CurrentUser() userId: string, @Body() dto: CreatePetDto) {
    return this.petService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '펫 정보 수정' })
  update(@CurrentUser() userId: string, @Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '펫 삭제' })
  delete(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.petService.delete(userId, id);
  }
}

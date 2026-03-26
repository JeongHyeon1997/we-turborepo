import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PageResponse } from '../../common/dto/page-response.dto';

export class CreatePetDiaryDto {
  petId: string;
  title?: string;
  content: string;
}

export class UpdatePetDiaryDto {
  title?: string;
  content?: string;
}

@Injectable()
export class PetDiaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getList(userId: string, petId: string, page: number, size: number): Promise<PageResponse<any>> {
    const skip = page * size;
    const [items, total] = await Promise.all([
      this.prisma.petDiaryEntry.findMany({
        where: { petId },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: size,
      }),
      this.prisma.petDiaryEntry.count({ where: { petId } }),
    ]);
    return PageResponse.of(items, total, page, size);
  }

  async getOne(userId: string, id: string) {
    const entry = await this.prisma.petDiaryEntry.findUnique({ where: { id }, include: { author: true } });
    if (!entry) throw new BadRequestException('다이어리를 찾을 수 없습니다');
    return entry;
  }

  async create(userId: string, dto: CreatePetDiaryDto) {
    return this.prisma.petDiaryEntry.create({
      data: { petId: dto.petId, authorId: userId, title: dto.title, content: dto.content },
      include: { author: true },
    });
  }

  async update(userId: string, id: string, dto: UpdatePetDiaryDto) {
    const entry = await this.prisma.petDiaryEntry.findUnique({ where: { id } });
    if (!entry) throw new BadRequestException('다이어리를 찾을 수 없습니다');
    if (entry.authorId !== userId) throw new BadRequestException('수정 권한이 없습니다');
    return this.prisma.petDiaryEntry.update({
      where: { id },
      data: { ...(dto.title !== undefined && { title: dto.title }), ...(dto.content && { content: dto.content }) },
      include: { author: true },
    });
  }

  async delete(userId: string, id: string) {
    const entry = await this.prisma.petDiaryEntry.findUnique({ where: { id } });
    if (!entry) throw new BadRequestException('다이어리를 찾을 수 없습니다');
    if (entry.authorId !== userId) throw new BadRequestException('삭제 권한이 없습니다');
    await this.prisma.petDiaryEntry.delete({ where: { id } });
  }
}

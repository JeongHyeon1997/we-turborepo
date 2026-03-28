import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PageResponse } from '../../common/dto/page-response.dto';

export class CreatePetDiaryDto {
  petId?: string;
  title?: string;
  content: string;
  mood?: string;
  moodLabel?: string;
  moodColor?: string;
  imageUrl?: string;
}

export class UpdatePetDiaryDto {
  title?: string;
  content?: string;
  mood?: string;
  moodLabel?: string;
  moodColor?: string;
  imageUrl?: string;
}

@Injectable()
export class PetDiaryService {
  constructor(private readonly prisma: PrismaService) {}

  private async getFamilyGroupId(userId: string): Promise<string | null> {
    const member = await this.prisma.familyGroupMember.findFirst({ where: { userId } });
    return member?.familyGroupId ?? null;
  }

  /**
   * 가족 그룹 있음 + petId → 해당 펫의 공유 일기 (가족 전체)
   * 가족 그룹 없음 or petId 없음 → 내가 작성한 일기만
   */
  async getList(userId: string, petId: string | undefined, page: number, size: number): Promise<PageResponse<any>> {
    const skip = page * size;
    const familyGroupId = await this.getFamilyGroupId(userId);

    const where = familyGroupId && petId ? { petId } : { authorId: userId };

    const [items, total] = await Promise.all([
      this.prisma.petDiaryEntry.findMany({
        where,
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: size,
      }),
      this.prisma.petDiaryEntry.count({ where }),
    ]);
    return PageResponse.of(items, total, page, size);
  }

  async getOne(userId: string, id: string) {
    const entry = await this.prisma.petDiaryEntry.findUnique({ where: { id }, include: { author: true } });
    if (!entry) throw new BadRequestException('다이어리를 찾을 수 없습니다');

    // 가족 그룹 있으면 같은 그룹 접근 허용, 없으면 본인 것만
    const familyGroupId = await this.getFamilyGroupId(userId);
    if (familyGroupId && entry.petId) {
      const pet = await this.prisma.pet.findUnique({ where: { id: entry.petId } });
      if (pet?.familyGroupId !== familyGroupId) throw new BadRequestException('접근 권한이 없습니다');
    } else if (entry.authorId !== userId) {
      throw new BadRequestException('접근 권한이 없습니다');
    }
    return entry;
  }

  async create(userId: string, dto: CreatePetDiaryDto) {
    return this.prisma.petDiaryEntry.create({
      data: {
        petId: dto.petId ?? null,
        authorId: userId,
        title: dto.title,
        content: dto.content,
        mood: dto.mood,
        moodLabel: dto.moodLabel,
        moodColor: dto.moodColor,
        imageUrl: dto.imageUrl,
      },
      include: { author: true },
    });
  }

  async update(userId: string, id: string, dto: UpdatePetDiaryDto) {
    const entry = await this.prisma.petDiaryEntry.findUnique({ where: { id } });
    if (!entry) throw new BadRequestException('다이어리를 찾을 수 없습니다');
    if (entry.authorId !== userId) throw new BadRequestException('수정 권한이 없습니다');
    return this.prisma.petDiaryEntry.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.mood !== undefined && { mood: dto.mood }),
        ...(dto.moodLabel !== undefined && { moodLabel: dto.moodLabel }),
        ...(dto.moodColor !== undefined && { moodColor: dto.moodColor }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
      },
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

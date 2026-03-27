import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiaryDto, UpdateDiaryDto } from './dto/diary.dto';
import { PageResponse } from '../../common/dto/page-response.dto';

@Injectable()
export class CoupleDiaryService {
  constructor(private readonly prisma: PrismaService) {}

  /** 연결된 커플이 있으면 반환, 없으면 null */
  private async findActiveConnection(userId: string) {
    return this.prisma.coupleConnection.findFirst({
      where: { status: 'ACTIVE', OR: [{ requesterId: userId }, { accepterId: userId }] },
    });
  }

  async getList(userId: string, page: number, size: number): Promise<PageResponse<any>> {
    const conn = await this.findActiveConnection(userId);
    const skip = page * size;

    // 연결된 커플이 있으면 공유 일기 전체, 없으면 내 일기만
    const where = conn
      ? { coupleConnectionId: conn.id }
      : { authorId: userId };

    const [items, total] = await Promise.all([
      this.prisma.coupleDiaryEntry.findMany({
        where,
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: size,
      }),
      this.prisma.coupleDiaryEntry.count({ where }),
    ]);
    return PageResponse.of(items, total, page, size);
  }

  async getOne(userId: string, id: string) {
    const entry = await this.prisma.coupleDiaryEntry.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!entry) throw new BadRequestException('다이어리를 찾을 수 없습니다');

    // 내 글이면 항상 접근 가능
    if (entry.authorId === userId) return entry;

    // 연결된 커플의 공유 글이면 접근 가능
    if (entry.coupleConnectionId) {
      const conn = await this.findActiveConnection(userId);
      if (conn && conn.id === entry.coupleConnectionId) return entry;
    }

    throw new BadRequestException('접근 권한이 없습니다');
  }

  async create(userId: string, dto: CreateDiaryDto) {
    const conn = await this.findActiveConnection(userId);
    return this.prisma.coupleDiaryEntry.create({
      data: {
        coupleConnectionId: conn?.id ?? null,
        authorId: userId,
        title: dto.title,
        content: dto.content,
        mood: dto.mood,
        moodLabel: dto.moodLabel,
        moodColor: dto.moodColor,
      },
      include: { author: true },
    });
  }

  async update(userId: string, id: string, dto: UpdateDiaryDto) {
    const entry = await this.prisma.coupleDiaryEntry.findUnique({ where: { id } });
    if (!entry) throw new BadRequestException('다이어리를 찾을 수 없습니다');
    if (entry.authorId !== userId) throw new BadRequestException('수정 권한이 없습니다');
    return this.prisma.coupleDiaryEntry.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.mood !== undefined && { mood: dto.mood }),
        ...(dto.moodLabel !== undefined && { moodLabel: dto.moodLabel }),
        ...(dto.moodColor !== undefined && { moodColor: dto.moodColor }),
      },
      include: { author: true },
    });
  }

  async delete(userId: string, id: string) {
    const entry = await this.prisma.coupleDiaryEntry.findUnique({ where: { id } });
    if (!entry) throw new BadRequestException('다이어리를 찾을 수 없습니다');
    if (entry.authorId !== userId) throw new BadRequestException('삭제 권한이 없습니다');
    await this.prisma.coupleDiaryEntry.delete({ where: { id } });
  }
}

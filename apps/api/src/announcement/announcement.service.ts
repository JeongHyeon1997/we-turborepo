import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PageResponse } from '../common/dto/page-response.dto';

@Injectable()
export class AnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  async getList(page: number, size: number): Promise<PageResponse<any>> {
    const skip = page * size;
    const [items, total] = await Promise.all([
      this.prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: size,
      }),
      this.prisma.announcement.count(),
    ]);
    return PageResponse.of(items, total, page, size);
  }

  async getOne(id: string) {
    const item = await this.prisma.announcement.findUnique({ where: { id } });
    if (!item) throw new BadRequestException('공지사항을 찾을 수 없습니다');
    return item;
  }
}

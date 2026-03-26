import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfirmCoupleDto, UpdateCoupleDto } from './dto/couple.dto';

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

@Injectable()
export class CoupleService {
  constructor(private readonly prisma: PrismaService) {}

  async getCouple(userId: string) {
    const connection = await this.prisma.coupleConnection.findFirst({
      where: {
        status: 'ACTIVE',
        OR: [{ requesterId: userId }, { accepterId: userId }],
      },
      include: { requester: true, accepter: true },
    });
    if (!connection) throw new BadRequestException('연결된 커플이 없습니다');
    return connection;
  }

  async createInvite(userId: string) {
    const active = await this.prisma.coupleConnection.findFirst({
      where: { status: 'ACTIVE', OR: [{ requesterId: userId }, { accepterId: userId }] },
    });
    if (active) throw new BadRequestException('이미 연결된 커플이 있습니다');

    const existing = await this.prisma.coupleInvite.findFirst({
      where: { requesterId: userId, used: false },
    });
    if (existing) return { inviteCode: existing.inviteCode, expiresAt: existing.expiresAt };

    const invite = await this.prisma.coupleInvite.create({
      data: {
        requesterId: userId,
        inviteCode: generateCode(),
        expiresAt: new Date(Date.now() + 86_400_000),
      },
    });
    return { inviteCode: invite.inviteCode, expiresAt: invite.expiresAt };
  }

  async confirmCouple(userId: string, dto: ConfirmCoupleDto) {
    const invite = await this.prisma.coupleInvite.findFirst({
      where: { inviteCode: dto.inviteCode, used: false },
    });
    if (!invite) throw new BadRequestException('유효하지 않은 초대 코드입니다');
    if (invite.expiresAt < new Date()) throw new BadRequestException('만료된 초대 코드입니다');
    if (invite.requesterId === userId) throw new BadRequestException('본인의 초대 코드는 사용할 수 없습니다');

    const [connection] = await this.prisma.$transaction([
      this.prisma.coupleConnection.create({
        data: {
          requesterId: invite.requesterId,
          accepterId: userId,
          status: 'ACTIVE',
          connectedAt: new Date(),
        },
        include: { requester: true, accepter: true },
      }),
      this.prisma.coupleInvite.update({ where: { id: invite.id }, data: { used: true } }),
    ]);
    return connection;
  }

  async updateCouple(userId: string, dto: UpdateCoupleDto) {
    const connection = await this.prisma.coupleConnection.findFirst({
      where: { status: 'ACTIVE', OR: [{ requesterId: userId }, { accepterId: userId }] },
    });
    if (!connection) throw new BadRequestException('연결된 커플이 없습니다');

    return this.prisma.coupleConnection.update({
      where: { id: connection.id },
      data: {
        ...(dto.coupleName !== undefined && { coupleName: dto.coupleName }),
        ...(dto.anniversaryDate !== undefined && { anniversaryDate: new Date(dto.anniversaryDate) }),
      },
      include: { requester: true, accepter: true },
    });
  }

  async disconnectCouple(userId: string) {
    const connection = await this.prisma.coupleConnection.findFirst({
      where: { status: 'ACTIVE', OR: [{ requesterId: userId }, { accepterId: userId }] },
    });
    if (!connection) throw new BadRequestException('연결된 커플이 없습니다');
    await this.prisma.coupleConnection.update({
      where: { id: connection.id },
      data: { status: 'DISCONNECTED' },
    });
  }
}

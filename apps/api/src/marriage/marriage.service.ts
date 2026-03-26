import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class ConfirmMarriageDto { inviteCode: string; }
export class UpdateMarriageDto { weddingDate?: string; shareStartDate?: string; }

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

@Injectable()
export class MarriageService {
  constructor(private readonly prisma: PrismaService) {}

  private async getActiveConnection(userId: string) {
    return this.prisma.marriageConnection.findFirst({
      where: { status: 'ACTIVE', OR: [{ user1Id: userId }, { user2Id: userId }] },
      include: { user1: true, user2: true },
    });
  }

  async getMarriage(userId: string) {
    const connection = await this.getActiveConnection(userId);
    if (!connection) throw new BadRequestException('연결된 부부가 없습니다');
    return connection;
  }

  async createInvite(userId: string) {
    const active = await this.getActiveConnection(userId);
    if (active) throw new BadRequestException('이미 연결된 부부가 있습니다');

    const existing = await this.prisma.marriageInvite.findFirst({
      where: { inviterId: userId, usedAt: null },
    });
    if (existing) return { inviteCode: existing.inviteCode, expiresAt: existing.expiresAt };

    const invite = await this.prisma.marriageInvite.create({
      data: { inviterId: userId, inviteCode: generateCode(), expiresAt: new Date(Date.now() + 86_400_000) },
    });
    return { inviteCode: invite.inviteCode, expiresAt: invite.expiresAt };
  }

  async confirmMarriage(userId: string, dto: ConfirmMarriageDto) {
    const invite = await this.prisma.marriageInvite.findFirst({
      where: { inviteCode: dto.inviteCode, usedAt: null },
    });
    if (!invite) throw new BadRequestException('유효하지 않은 초대 코드입니다');
    if (invite.expiresAt < new Date()) throw new BadRequestException('만료된 초대 코드입니다');
    if (invite.inviterId === userId) throw new BadRequestException('본인의 초대 코드는 사용할 수 없습니다');

    const now = new Date();
    const [connection] = await this.prisma.$transaction([
      this.prisma.marriageConnection.create({
        data: { user1Id: invite.inviterId, user2Id: userId, status: 'ACTIVE', connectedAt: now },
        include: { user1: true, user2: true },
      }),
      this.prisma.marriageInvite.update({ where: { id: invite.id }, data: { usedAt: now } }),
    ]);
    return connection;
  }

  async updateMarriage(userId: string, dto: UpdateMarriageDto) {
    const connection = await this.getActiveConnection(userId);
    if (!connection) throw new BadRequestException('연결된 부부가 없습니다');
    return this.prisma.marriageConnection.update({
      where: { id: connection.id },
      data: {
        ...(dto.weddingDate !== undefined && { weddingDate: dto.weddingDate ? new Date(dto.weddingDate) : null }),
        ...(dto.shareStartDate !== undefined && { shareStartDate: dto.shareStartDate ? new Date(dto.shareStartDate) : null }),
      },
      include: { user1: true, user2: true },
    });
  }

  async disconnectMarriage(userId: string) {
    const connection = await this.getActiveConnection(userId);
    if (!connection) throw new BadRequestException('연결된 부부가 없습니다');
    await this.prisma.marriageConnection.update({ where: { id: connection.id }, data: { status: 'DISCONNECTED' } });
  }
}

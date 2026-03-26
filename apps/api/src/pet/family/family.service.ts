import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFamilyDto, JoinFamilyDto } from './dto/family.dto';

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

@Injectable()
export class FamilyService {
  constructor(private readonly prisma: PrismaService) {}

  private async getGroupByUser(userId: string) {
    return this.prisma.familyGroup.findFirst({
      where: { members: { some: { userId } } },
      include: { members: { include: { user: true } }, pets: true },
    });
  }

  async getFamily(userId: string) {
    const group = await this.getGroupByUser(userId);
    if (!group) throw new BadRequestException('가족 그룹이 없습니다');
    return group;
  }

  async createFamily(userId: string, dto: CreateFamilyDto) {
    return this.prisma.familyGroup.create({
      data: {
        name: dto.name,
        createdBy: userId,
        members: { create: { userId, role: 'OWNER' } },
      },
      include: { members: { include: { user: true } }, pets: true },
    });
  }

  async createInvite(userId: string) {
    const group = await this.getGroupByUser(userId);
    if (!group) throw new BadRequestException('가족 그룹이 없습니다');
    const invite = await this.prisma.familyInvite.create({
      data: { familyGroupId: group.id, inviteCode: generateCode(), expiresAt: new Date(Date.now() + 86_400_000) },
    });
    return { inviteCode: invite.inviteCode, expiresAt: invite.expiresAt };
  }

  async joinFamily(userId: string, dto: JoinFamilyDto) {
    const invite = await this.prisma.familyInvite.findFirst({
      where: { inviteCode: dto.inviteCode, used: false },
    });
    if (!invite) throw new BadRequestException('유효하지 않은 초대 코드입니다');
    if (invite.expiresAt < new Date()) throw new BadRequestException('만료된 초대 코드입니다');

    await this.prisma.$transaction([
      this.prisma.familyGroupMember.create({ data: { familyGroupId: invite.familyGroupId, userId, role: 'MEMBER' } }),
      this.prisma.familyInvite.update({ where: { id: invite.id }, data: { used: true } }),
    ]);
    return this.prisma.familyGroup.findUnique({
      where: { id: invite.familyGroupId },
      include: { members: { include: { user: true } }, pets: true },
    });
  }

  async leaveFamily(userId: string) {
    const group = await this.getGroupByUser(userId);
    if (!group) throw new BadRequestException('가족 그룹이 없습니다');
    await this.prisma.familyGroupMember.delete({ where: { familyGroupId_userId: { familyGroupId: group.id, userId } } });
    const remaining = await this.prisma.familyGroupMember.count({ where: { familyGroupId: group.id } });
    if (remaining === 0) await this.prisma.familyGroup.delete({ where: { id: group.id } });
  }

  async removeMember(currentUserId: string, targetUserId: string) {
    const group = await this.getGroupByUser(currentUserId);
    if (!group) throw new BadRequestException('가족 그룹이 없습니다');
    const currentMember = group.members.find((m) => m.userId === currentUserId);
    if (currentMember?.role !== 'OWNER') throw new BadRequestException('강퇴 권한이 없습니다');
    await this.prisma.familyGroupMember.delete({
      where: { familyGroupId_userId: { familyGroupId: group.id, userId: targetUserId } },
    });
  }
}

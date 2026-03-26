import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';

@Injectable()
export class PetService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserGroupId(userId: string): Promise<string> {
    const member = await this.prisma.familyGroupMember.findFirst({ where: { userId } });
    if (!member) throw new BadRequestException('가족 그룹이 없습니다');
    return member.familyGroupId;
  }

  async getList(userId: string) {
    const familyGroupId = await this.getUserGroupId(userId);
    return this.prisma.pet.findMany({ where: { familyGroupId } });
  }

  async getOne(userId: string, id: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) throw new BadRequestException('펫을 찾을 수 없습니다');
    const familyGroupId = await this.getUserGroupId(userId);
    if (pet.familyGroupId !== familyGroupId) throw new BadRequestException('접근 권한이 없습니다');
    return pet;
  }

  async create(userId: string, dto: CreatePetDto) {
    const familyGroupId = await this.getUserGroupId(userId);
    return this.prisma.pet.create({
      data: {
        familyGroupId,
        name: dto.name,
        species: dto.species,
        breed: dto.breed,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        profileImageUrl: dto.profileImageUrl,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdatePetDto) {
    await this.getOne(userId, id);
    return this.prisma.pet.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.species !== undefined && { species: dto.species }),
        ...(dto.breed !== undefined && { breed: dto.breed }),
        ...(dto.birthDate !== undefined && { birthDate: dto.birthDate ? new Date(dto.birthDate) : null }),
        ...(dto.profileImageUrl !== undefined && { profileImageUrl: dto.profileImageUrl }),
      },
    });
  }

  async delete(userId: string, id: string) {
    await this.getOne(userId, id);
    await this.prisma.pet.delete({ where: { id } });
  }
}

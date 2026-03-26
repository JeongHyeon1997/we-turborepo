import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { TokenResponse } from './dto/token-response.dto';
import { SocialClient, SOCIAL_CLIENTS } from './social/social-client.interface';

@Injectable()
export class AuthService {
  private readonly clientMap: Map<string, SocialClient>;
  private readonly accessExpiryMs: number;
  private readonly refreshExpiryMs: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @Inject(SOCIAL_CLIENTS) private readonly socialClients: SocialClient[],
  ) {
    this.clientMap = new Map(socialClients.map((c) => [c.provider, c]));
    this.accessExpiryMs = config.get<number>('JWT_ACCESS_EXPIRY_MS', 3_600_000);
    this.refreshExpiryMs = config.get<number>('JWT_REFRESH_EXPIRY_MS', 2_592_000_000);
  }

  async signup(dto: SignupDto): Promise<TokenResponse> {
    const existing = await this.prisma.user.findFirst({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('이미 사용 중인 이메일입니다');

    const user = await this.prisma.user.create({
      data: {
        provider: 'LOCAL',
        providerId: dto.email,
        email: dto.email,
        nickname: dto.nickname,
        passwordHash: await bcrypt.hash(dto.password, 10),
      },
    });
    return this.issueTokens(user.id);
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    if (dto.type === 'email') {
      if (!dto.email || !dto.password) throw new BadRequestException('email, password 필드가 필요합니다');
      return this.loginWithEmail(dto.email, dto.password);
    }
    if (dto.type === 'oauth') {
      if (!dto.provider || !dto.accessToken) throw new BadRequestException('provider, accessToken 필드가 필요합니다');
      return this.loginWithOAuth(dto.provider, dto.accessToken);
    }
    throw new BadRequestException(`지원하지 않는 로그인 타입: ${dto.type}`);
  }

  private async loginWithEmail(email: string, password: string): Promise<TokenResponse> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new BadRequestException('이메일 또는 비밀번호가 올바르지 않습니다');
    }
    return this.issueTokens(user.id);
  }

  private async loginWithOAuth(provider: string, accessToken: string): Promise<TokenResponse> {
    const client = this.clientMap.get(provider);
    if (!client) throw new BadRequestException(`지원하지 않는 소셜 로그인: ${provider}`);

    const info = await client.getUserInfo(accessToken);
    let user = await this.prisma.user.findFirst({
      where: { provider, providerId: info.providerId },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          provider,
          providerId: info.providerId,
          email: info.email,
          nickname: info.nickname,
          profileImageUrl: info.profileImageUrl,
        },
      });
    }
    return this.issueTokens(user.id);
  }

  async refresh(dto: RefreshDto): Promise<TokenResponse> {
    const saved = await this.prisma.refreshToken.findUnique({ where: { token: dto.refreshToken } });
    if (!saved) throw new BadRequestException('유효하지 않은 리프레시 토큰');
    if (saved.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: saved.id } });
      throw new BadRequestException('만료된 리프레시 토큰');
    }
    await this.prisma.refreshToken.delete({ where: { id: saved.id } });
    return this.issueTokens(saved.userId);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  private async issueTokens(userId: string): Promise<TokenResponse> {
    const secret = Buffer.from(this.config.get<string>('JWT_SECRET', ''), 'base64');
    const accessToken = this.jwt.sign(
      { sub: userId },
      { secret, expiresIn: Math.floor(this.accessExpiryMs / 1000) },
    );
    const rawRefreshToken = uuidv4();
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: rawRefreshToken,
        expiresAt: new Date(Date.now() + this.refreshExpiryMs),
      },
    });
    return { accessToken, refreshToken: rawRefreshToken, expiresIn: Math.floor(this.accessExpiryMs / 1000) };
  }
}

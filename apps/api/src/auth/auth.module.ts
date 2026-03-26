import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { GoogleSocialClient } from './social/google.social-client';
import { KakaoSocialClient } from './social/kakao.social-client';
import { NaverSocialClient } from './social/naver.social-client';
import { SOCIAL_CLIENTS } from './social/social-client.interface';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleSocialClient,
    KakaoSocialClient,
    NaverSocialClient,
    {
      provide: SOCIAL_CLIENTS,
      useFactory: (google: GoogleSocialClient, kakao: KakaoSocialClient, naver: NaverSocialClient) =>
        [google, kakao, naver],
      inject: [GoogleSocialClient, KakaoSocialClient, NaverSocialClient],
    },
  ],
})
export class AuthModule {}

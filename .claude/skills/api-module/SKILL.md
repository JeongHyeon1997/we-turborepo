---
name: api-module
description: NestJS에 새 도메인 모듈(Controller + Service + DTO + Module)을 추가한다. apps/api/src/ 아래 기존 패턴을 그대로 따른다.
argument-hint: [도메인명]
---

# API Module Skill

`apps/api/src/` 에 새 NestJS 모듈을 추가한다.

## 디렉토리 구조 (단순 도메인)

```
src/{domain}/
├── {domain}.module.ts
├── {domain}.controller.ts
├── {domain}.service.ts
└── dto/
    └── {domain}.dto.ts
```

## 디렉토리 구조 (서브도메인 포함)

```
src/{domain}/
├── {domain}.module.ts
├── {sub1}/
│   ├── {sub1}.controller.ts
│   ├── {sub1}.service.ts
│   └── dto/
│       └── {sub1}.dto.ts
└── {sub2}/
    ├── {sub2}.controller.ts
    ├── {sub2}.service.ts
    └── dto/
        └── {sub2}.dto.ts
```

## 핵심 규칙

### Controller
- `@ApiTags('{domain}')` 반드시 추가
- 각 메서드에 `@ApiOperation({ summary: '...' })` 추가
- 인증 불필요 엔드포인트만 `@Public()` 추가 — 나머지는 JwtAuthGuard가 자동 적용
- 현재 유저 ID 추출: `@CurrentUser() userId: string`
- 응답 타입 명시: `@ApiResponse({ type: XxxResponseDto })`

```ts
@ApiTags('domain')
@Controller('domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get()
  @ApiOperation({ summary: '목록 조회' })
  async findAll(@CurrentUser() userId: string) {
    return this.domainService.findAll(userId);
  }
}
```

### Service
- Prisma 사용: `constructor(private readonly prisma: PrismaService) {}`
- 비즈니스 로직 에러: `throw new NotFoundException('...')` 등 NestJS 내장 예외 사용
- 트랜잭션 필요 시: `this.prisma.$transaction([...])`

```ts
@Injectable()
export class DomainService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.someTable.findMany({ where: { userId } });
  }
}
```

### DTO
- `class-validator` 데코레이터 사용
- `@ApiProperty()` / `@ApiPropertyOptional()` 반드시 추가
- 선택 필드는 `@IsOptional()` + `@ApiPropertyOptional()`

```ts
export class CreateDomainDto {
  @ApiProperty({ example: '제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;
}
```

### Module
- `PrismaModule`을 imports에 추가하거나 `PrismaService`를 providers에 직접 등록
- Controller/Service를 반드시 등록

```ts
@Module({
  imports: [PrismaModule],
  controllers: [DomainController],
  providers: [DomainService],
})
export class DomainModule {}
```

### app.module.ts 등록
모듈 생성 후 반드시 `src/app.module.ts` 의 `imports` 배열에 추가.

## 페이지네이션 패턴

```ts
// DTO
export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsInt() @Min(1) @IsOptional() @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsInt() @Min(1) @Max(100) @IsOptional() @Type(() => Number)
  size: number = 20;
}

// Service
async findAll(query: PaginationQueryDto) {
  const { page, size } = query;
  const skip = (page - 1) * size;
  const [items, total] = await this.prisma.$transaction([
    this.prisma.table.findMany({ skip, take: size, orderBy: { createdAt: 'desc' } }),
    this.prisma.table.count(),
  ]);
  return { items, total, page, size, totalPages: Math.ceil(total / size) };
}
```

## 초대 코드 패턴 (Couple/Pet/Marriage 공통)

```ts
// 6자리 랜덤 코드 생성
const code = Math.random().toString(36).slice(2, 8).toUpperCase();
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
```

## 실행 순서

1. 도메인 파악 및 서브도메인 여부 결정
2. 파일 구조 계획 출력
3. 승인 후 dto → service → controller → module 순으로 생성
4. app.module.ts 에 등록
5. `bun turbo run build --filter=@we/api` 로 빌드 확인

$ARGUMENTS

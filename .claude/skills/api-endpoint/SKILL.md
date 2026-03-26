---
name: api-endpoint
description: 기존 NestJS 모듈에 새 엔드포인트를 추가한다. Controller에 메서드, Service에 로직, DTO 추가까지 한 번에 처리한다.
argument-hint: [대상 모듈 경로 또는 설명]
---

# API Endpoint Skill

기존 모듈에 새 엔드포인트를 추가한다.

## 실행 순서

1. 대상 Controller / Service / DTO 파일 읽기
2. 추가할 엔드포인트 계획 출력 (메서드, 경로, DTO, 로직)
3. 승인 후 DTO → Service → Controller 순으로 수정

## HTTP 메서드별 패턴

### GET (목록)
```ts
@Get()
@ApiOperation({ summary: '목록 조회' })
async findAll(
  @CurrentUser() userId: string,
  @Query() query: PaginationQueryDto,
) {
  return this.service.findAll(userId, query);
}
```

### GET (단건)
```ts
@Get(':id')
@ApiOperation({ summary: '상세 조회' })
async findOne(
  @CurrentUser() userId: string,
  @Param('id') id: string,
) {
  return this.service.findOne(userId, id);
}
```

### POST
```ts
@Post()
@ApiOperation({ summary: '생성' })
async create(
  @CurrentUser() userId: string,
  @Body() dto: CreateXxxDto,
) {
  return this.service.create(userId, dto);
}
```

### PUT
```ts
@Put(':id')
@ApiOperation({ summary: '수정' })
async update(
  @CurrentUser() userId: string,
  @Param('id') id: string,
  @Body() dto: UpdateXxxDto,
) {
  return this.service.update(userId, id, dto);
}
```

### DELETE
```ts
@Delete(':id')
@HttpCode(204)
@ApiOperation({ summary: '삭제' })
async remove(
  @CurrentUser() userId: string,
  @Param('id') id: string,
) {
  await this.service.remove(userId, id);
}
```

## Service 에러 처리 패턴

```ts
// 존재 확인
const item = await this.prisma.table.findUnique({ where: { id } });
if (!item) throw new NotFoundException('항목을 찾을 수 없습니다.');

// 권한 확인
if (item.userId !== userId) throw new ForbiddenException('권한이 없습니다.');
```

## 규칙

- 공개 엔드포인트(로그인 불필요)만 `@Public()` 추가
- 모든 에러는 NestJS 내장 예외 사용 (`NotFoundException`, `ForbiddenException`, `BadRequestException`, `ConflictException`)
- 새 DTO 필드는 `@ApiProperty` + `class-validator` 데코레이터 세트로 추가
- 204 응답은 `@HttpCode(204)` + `void` 반환

$ARGUMENTS

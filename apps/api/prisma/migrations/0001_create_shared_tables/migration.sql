-- ============================================================
-- shared schema: 소셜 로그인 공통 사용자 테이블
-- ============================================================

CREATE TABLE shared.users
(
    id                UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    provider          VARCHAR(20)  NOT NULL, -- GOOGLE, KAKAO, APPLE, NAVER
    provider_id       VARCHAR(255) NOT NULL,
    email             VARCHAR(255),
    nickname          VARCHAR(100) NOT NULL,
    profile_image_url VARCHAR(500),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_id)
);

CREATE INDEX idx_users_provider_provider_id ON shared.users (provider, provider_id);

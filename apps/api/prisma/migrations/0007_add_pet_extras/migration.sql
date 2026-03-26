-- ============================================================
-- pet schema: 펫 앱 추가 테이블 및 컬럼
-- ============================================================

-- community_posts에 집계 캐시 컬럼 추가
ALTER TABLE pet.community_posts
    ADD COLUMN like_count    INT NOT NULL DEFAULT 0,
    ADD COLUMN comment_count INT NOT NULL DEFAULT 0;

-- ----

CREATE TABLE pet.family_invites
(
    id              UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    family_group_id UUID        NOT NULL REFERENCES pet.family_groups (id),
    invite_code     VARCHAR(10) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    used            BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_family_invites_code    ON pet.family_invites (invite_code);
CREATE INDEX idx_family_invites_expires ON pet.family_invites (expires_at);

-- ----

CREATE TABLE pet.community_likes
(
    post_id    UUID        NOT NULL REFERENCES pet.community_posts (id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES shared.users (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- ----

CREATE TABLE pet.community_comments
(
    id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id    UUID        NOT NULL REFERENCES pet.community_posts (id) ON DELETE CASCADE,
    author_id  UUID        NOT NULL REFERENCES shared.users (id),
    content    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pet_comments_post    ON pet.community_comments (post_id);
CREATE INDEX idx_pet_comments_created ON pet.community_comments (created_at);

-- ----

CREATE TABLE pet.community_reports
(
    id          UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id     UUID         NOT NULL REFERENCES pet.community_posts (id) ON DELETE CASCADE,
    reporter_id UUID         NOT NULL REFERENCES shared.users (id),
    reason      VARCHAR(500) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (post_id, reporter_id)
);

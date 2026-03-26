-- ============================================================
-- couple schema: 커플 앱 추가 테이블 및 컬럼
-- ============================================================

-- couple_connections에 커플 설정 컬럼 추가
ALTER TABLE couple.couple_connections
    ADD COLUMN couple_name     VARCHAR(100),
    ADD COLUMN anniversary_date DATE;

-- community_posts에 집계 캐시 컬럼 추가
ALTER TABLE couple.community_posts
    ADD COLUMN like_count    INT NOT NULL DEFAULT 0,
    ADD COLUMN comment_count INT NOT NULL DEFAULT 0;

-- ----

CREATE TABLE couple.couple_invites
(
    id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID        NOT NULL REFERENCES shared.users (id),
    invite_code  VARCHAR(10) NOT NULL UNIQUE,
    expires_at   TIMESTAMPTZ NOT NULL,
    used         BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_couple_invites_code    ON couple.couple_invites (invite_code);
CREATE INDEX idx_couple_invites_expires ON couple.couple_invites (expires_at);

-- ----

CREATE TABLE couple.community_likes
(
    post_id    UUID        NOT NULL REFERENCES couple.community_posts (id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES shared.users (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- ----

CREATE TABLE couple.community_comments
(
    id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id    UUID        NOT NULL REFERENCES couple.community_posts (id) ON DELETE CASCADE,
    author_id  UUID        NOT NULL REFERENCES shared.users (id),
    content    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_couple_comments_post    ON couple.community_comments (post_id);
CREATE INDEX idx_couple_comments_created ON couple.community_comments (created_at);

-- ----

CREATE TABLE couple.community_reports
(
    id          UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id     UUID         NOT NULL REFERENCES couple.community_posts (id) ON DELETE CASCADE,
    reporter_id UUID         NOT NULL REFERENCES shared.users (id),
    reason      VARCHAR(500) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (post_id, reporter_id)
);

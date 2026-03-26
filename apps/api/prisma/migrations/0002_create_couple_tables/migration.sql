-- ============================================================
-- couple schema: 커플 앱 전용 테이블
-- ============================================================

CREATE TABLE couple.couple_connections
(
    id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID        NOT NULL REFERENCES shared.users (id),
    accepter_id  UUID        NOT NULL REFERENCES shared.users (id),
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, ACTIVE, DISCONNECTED
    connected_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_couple_connections_requester ON couple.couple_connections (requester_id);
CREATE INDEX idx_couple_connections_accepter ON couple.couple_connections (accepter_id);
CREATE INDEX idx_couple_connections_status ON couple.couple_connections (status);

-- ----

CREATE TABLE couple.diary_entries
(
    id                    UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_connection_id  UUID        NOT NULL REFERENCES couple.couple_connections (id),
    author_id             UUID        NOT NULL REFERENCES shared.users (id),
    title                 VARCHAR(200),
    content               TEXT        NOT NULL,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_couple_diary_connection ON couple.diary_entries (couple_connection_id);
CREATE INDEX idx_couple_diary_author ON couple.diary_entries (author_id);
CREATE INDEX idx_couple_diary_created ON couple.diary_entries (created_at DESC);

-- ----

CREATE TABLE couple.community_posts
(
    id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id  UUID         NOT NULL REFERENCES shared.users (id),
    title      VARCHAR(200) NOT NULL,
    content    TEXT         NOT NULL,
    category   VARCHAR(50),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_couple_posts_author ON couple.community_posts (author_id);
CREATE INDEX idx_couple_posts_category ON couple.community_posts (category);
CREATE INDEX idx_couple_posts_created ON couple.community_posts (created_at DESC);

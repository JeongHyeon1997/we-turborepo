-- ============================================================
-- shared schema: JWT 리프레시 토큰 저장
-- ============================================================

CREATE TABLE shared.refresh_tokens
(
    id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID         NOT NULL REFERENCES shared.users (id) ON DELETE CASCADE,
    token      VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user    ON shared.refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires ON shared.refresh_tokens (expires_at);

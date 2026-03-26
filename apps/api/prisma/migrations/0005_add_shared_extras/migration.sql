-- ============================================================
-- shared.users: 이메일/비밀번호 로그인용 컬럼 추가
-- ============================================================

ALTER TABLE shared.users
    ADD COLUMN password_hash VARCHAR(255);

-- ============================================================
-- shared.announcements: 공지사항 (전체 앱 공통)
-- ============================================================

CREATE TABLE shared.announcements
(
    id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT         NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_created ON shared.announcements (created_at DESC);

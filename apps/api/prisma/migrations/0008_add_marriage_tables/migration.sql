CREATE SCHEMA IF NOT EXISTS marriage;

CREATE TABLE marriage.marriage_connections
(
    id               UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id         UUID        NOT NULL REFERENCES shared.users (id),
    user2_id         UUID        NOT NULL REFERENCES shared.users (id),
    status           VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    wedding_date     DATE,
    share_start_date DATE,
    connected_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marriage_connections_user1  ON marriage.marriage_connections (user1_id);
CREATE INDEX idx_marriage_connections_user2  ON marriage.marriage_connections (user2_id);
CREATE INDEX idx_marriage_connections_status ON marriage.marriage_connections (status);

CREATE TABLE marriage.marriage_invites
(
    id          UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    inviter_id  UUID         NOT NULL REFERENCES shared.users (id),
    invite_code VARCHAR(10)  NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ  NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marriage_invites_inviter ON marriage.marriage_invites (inviter_id);
CREATE INDEX idx_marriage_invites_code    ON marriage.marriage_invites (invite_code);

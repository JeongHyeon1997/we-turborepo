-- ============================================================
-- pet schema: 펫 앱 전용 테이블
-- ============================================================

CREATE TABLE pet.family_groups
(
    id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    created_by UUID         NOT NULL REFERENCES shared.users (id),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ----

CREATE TABLE pet.family_group_members
(
    family_group_id UUID        NOT NULL REFERENCES pet.family_groups (id),
    user_id         UUID        NOT NULL REFERENCES shared.users (id),
    role            VARCHAR(20) NOT NULL DEFAULT 'MEMBER', -- OWNER, MEMBER
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (family_group_id, user_id)
);

CREATE INDEX idx_pet_members_user ON pet.family_group_members (user_id);

-- ----

CREATE TABLE pet.pets
(
    id                UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    family_group_id   UUID         NOT NULL REFERENCES pet.family_groups (id),
    name              VARCHAR(100) NOT NULL,
    species           VARCHAR(50),            -- DOG, CAT, RABBIT, ...
    breed             VARCHAR(100),
    birth_date        DATE,
    profile_image_url VARCHAR(500),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pets_family_group ON pet.pets (family_group_id);

-- ----

CREATE TABLE pet.diary_entries
(
    id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pet_id     UUID        NOT NULL REFERENCES pet.pets (id),
    author_id  UUID        NOT NULL REFERENCES shared.users (id),
    title      VARCHAR(200),
    content    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pet_diary_pet ON pet.diary_entries (pet_id);
CREATE INDEX idx_pet_diary_author ON pet.diary_entries (author_id);
CREATE INDEX idx_pet_diary_created ON pet.diary_entries (created_at DESC);

-- ----

CREATE TABLE pet.community_posts
(
    id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id  UUID         NOT NULL REFERENCES shared.users (id),
    title      VARCHAR(200) NOT NULL,
    content    TEXT         NOT NULL,
    category   VARCHAR(50),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pet_posts_author ON pet.community_posts (author_id);
CREATE INDEX idx_pet_posts_category ON pet.community_posts (category);
CREATE INDEX idx_pet_posts_created ON pet.community_posts (created_at DESC);

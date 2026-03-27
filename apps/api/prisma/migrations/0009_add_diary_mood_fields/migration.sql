-- couple.diary_entries에 mood 필드 추가
ALTER TABLE couple.diary_entries
  ADD COLUMN IF NOT EXISTS mood        VARCHAR(10),
  ADD COLUMN IF NOT EXISTS mood_label  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS mood_color  VARCHAR(20);

-- pet.diary_entries에 mood 필드 추가
ALTER TABLE pet.diary_entries
  ADD COLUMN IF NOT EXISTS mood        VARCHAR(10),
  ADD COLUMN IF NOT EXISTS mood_label  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS mood_color  VARCHAR(20);

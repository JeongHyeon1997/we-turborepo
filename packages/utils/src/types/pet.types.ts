// ─── Pet ──────────────────────────────────────────────────────────────────────

export interface PetInfo {
  id: string;
  familyGroupId: string;
  name: string;
  species?: string | null;
  breed?: string | null;
  birthDate?: string | null;
  profileImageUrl?: string | null;
  createdAt: string;
}

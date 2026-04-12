export type UserRole = "ADMIN" | "USER";

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

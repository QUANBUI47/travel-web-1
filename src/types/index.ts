import { SVGProps } from "react";

export type SupportedLocale = 'vi' | 'en';

export type UserRole = 'ADMIN' | 'USER';

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

export interface Region {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

export interface Destination {
  id: string;
  regionId: string;
  slug: string;
  nameVi: string;
  nameEn: string | null;
  description: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  sortOrder: number;
  region?: Region;
}

export type CreateDestinationInput = Omit<Destination, 'id' | 'region'>;
export type UpdateDestinationInput = Partial<CreateDestinationInput>;

export interface HomeSetting {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImages?: string[];
  statCustomers?: string;
  statPartners?: string;
  statExperience?: string;
  storyTitle?: string;
  storyContent?: string;
  featuredDestinations?: string[];
  featuredTours?: string[];
}

export interface SystemSetting {
  id: string;
  group: string;
  key: string;
  value: any; // Giá trị cụ thể phụ thuộc vào key, tạm thời để any hoặc dùng Record
  description?: string;
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

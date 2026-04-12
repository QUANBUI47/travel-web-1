import { HomeModule } from "./builder";

export interface HomeSetting {
  modules?: HomeModule[];
  // Các trường cũ để đảm bảo tương thích ngược nếu cần
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
  value: unknown;
  description?: string;
}

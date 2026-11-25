export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  designation: string;
  specialization: string;
  location: string;
  experienceLevel: string;
  bio: string;
  interests: string;
}

export interface ProfileStats {
  skills: number;
  projects: number;
}

export interface ProfileOverview {
  stats: ProfileStats;
}

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
  profileVisibility: ProfileVisibility;
}

export interface ProfileFormData {
  name: string;
  role: string;
  location: string;
  bio: string;
  visibleInDiscover: boolean;
}

export interface ProfileVisibility {
  visibleInDiscover: boolean;
}

export interface ProfileChecklistItem {
  label: string;
  completed: boolean;
}

export interface ProfileChecklist {
  items: ProfileChecklistItem[];
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
}

export interface ProfileStats {
  skills: number;
  projects: number;
}

export interface ProfileOverview {
  stats: ProfileStats;
}

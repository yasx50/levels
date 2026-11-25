import { mockProfileService } from '@/services/profile.mock';
import type { ProfileOverview, UserProfile } from '@/types/profile';

export type ProfileService = {
  getCurrentUserProfile: () => Promise<UserProfile | null>;
  getProfileOverview: () => Promise<ProfileOverview>;
  getProfileById: (profileId: string) => Promise<UserProfile | null>;
};

// TODO: Connect profile reads through the existing API client after the backend
// provides endpoint and response contracts. No network request is made here.
// TODO: Add profile and avatar update operations after their request/response
// contracts are provided; do not assume endpoints or HTTP methods.
export const profileService: ProfileService = mockProfileService;

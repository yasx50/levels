import { mockProfileService } from '@/services/profile.mock';
import type {
  ProfileFormData,
  ProfileOverview,
  ProfileVisibility,
  UserProfile,
} from '@/types/profile';

export type ProfileService = {
  getCurrentUserProfile: () => Promise<UserProfile | null>;
  getProfileOverview: () => Promise<ProfileOverview>;
  getProfileById: (profileId: string) => Promise<UserProfile | null>;
  updateUserProfile: (input: ProfileFormData) => Promise<UserProfile>;
  updateProfileVisibility: (visibility: ProfileVisibility) => Promise<UserProfile>;
  uploadProfileAvatar: (avatar: unknown) => Promise<UserProfile>;
};

// TODO: Connect profile reads through the existing API client after the backend
// provides endpoint and response contracts. No network request is made here.
// TODO: Add profile and avatar update operations after their request/response
// contracts are provided; do not assume endpoints or HTTP methods.
export const profileService: ProfileService = mockProfileService;

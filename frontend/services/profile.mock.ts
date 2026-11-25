import type { ProfileOverview, UserProfile } from '@/types/profile';

const mockUserProfile: UserProfile = {
  id: 'current-user',
  name: 'Alex Morgan',
  avatarUrl: null,
  designation: 'Product Designer',
  specialization: 'Product & Systems Design',
  location: 'San Francisco, CA',
  experienceLevel: 'Level 4 · Builder',
  bio: 'Build systems that make good work easier to see, trust, and grow.',
  interests:
    'I’m interested in thoughtful tools, collaborative teams, and helping people do their best work.',
};

const mockProfileOverview: ProfileOverview = {
  stats: {
    skills: 12,
    projects: 8,
  },
};

function cloneProfile(profile: UserProfile): UserProfile {
  return { ...profile };
}

export const mockProfileService = {
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    return cloneProfile(mockUserProfile);
  },

  async getProfileOverview(): Promise<ProfileOverview> {
    return { stats: { ...mockProfileOverview.stats } };
  },

  async getProfileById(profileId: string): Promise<UserProfile | null> {
    return profileId === mockUserProfile.id
      ? cloneProfile(mockUserProfile)
      : null;
  },
};

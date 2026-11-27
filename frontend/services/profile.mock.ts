import type {
  ProfileFormData,
  ProfileOverview,
  ProfileVisibility,
  UserProfile,
} from '@/types/profile';

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
  profileVisibility: {
    visibleInDiscover: true,
  },
};

const mockProfileOverview: ProfileOverview = {
  stats: {
    skills: 12,
    projects: 8,
  },
};

function cloneProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    profileVisibility: { ...profile.profileVisibility },
  };
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

  async updateUserProfile(input: ProfileFormData): Promise<UserProfile> {
    const separatorIndex = input.role.indexOf(' · ');
    const designation =
      separatorIndex >= 0 ? input.role.slice(0, separatorIndex).trim() : input.role.trim();
    const specialization =
      separatorIndex >= 0 ? input.role.slice(separatorIndex + 3).trim() : '';

    Object.assign(mockUserProfile, {
      name: input.name.trim(),
      designation,
      specialization,
      location: input.location.trim(),
      bio: input.bio.trim(),
      profileVisibility: {
        visibleInDiscover: input.visibleInDiscover,
      },
    });

    return cloneProfile(mockUserProfile);
  },

  async updateProfileVisibility(
    visibility: ProfileVisibility,
  ): Promise<UserProfile> {
    mockUserProfile.profileVisibility = { ...visibility };
    return cloneProfile(mockUserProfile);
  },

  async uploadProfileAvatar(_avatar: unknown): Promise<UserProfile> {
    // TODO: Connect this placeholder to the real avatar upload contract.
    throw new Error('Profile avatar uploads are not configured yet.');
  },
};

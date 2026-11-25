import { useQuery } from '@tanstack/react-query';

import { profileService } from '@/services/profile';

export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  overview: () => [...profileKeys.all, 'overview'] as const,
  detail: (profileId: string) => [...profileKeys.all, 'detail', profileId] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: async () => {
      const [profile, overview] = await Promise.all([
        profileService.getCurrentUserProfile(),
        profileService.getProfileOverview(),
      ]);
      return { profile, overview };
    },
  });
}

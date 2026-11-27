import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { profileService } from '@/services/profile';
import type { ProfileFormData } from '@/types/profile';

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

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProfileFormData) =>
      profileService.updateUserProfile(input),
    onSuccess: async (profile) => {
      queryClient.setQueryData(
        profileKeys.current(),
        (current: { profile: typeof profile; overview: unknown } | undefined) =>
          current ? { ...current, profile } : current,
      );
      await queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}

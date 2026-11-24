import { useMutation, useQuery } from '@tanstack/react-query';

import {
  cancelOutgoingConnectionRequest,
  getSuggestedPeople,
  sendConnectionRequest,
} from '@/services/discover';

export const discoverKeys = {
  all: ['discover'] as const,
  suggestedPeople: () => [...discoverKeys.all, 'people', 'suggested'] as const,
  peopleSearch: (query: string) => [...discoverKeys.all, 'people', 'search', query] as const,
  skillsSearch: (query: string) => [...discoverKeys.all, 'skills', 'search', query] as const,
  projectsSearch: (query: string) => [...discoverKeys.all, 'projects', 'search', query] as const,
};

// Placeholder hooks: intentionally disabled until actual endpoint contracts are provided.
export function useSuggestedPeople() {
  return useQuery({
    queryKey: discoverKeys.suggestedPeople(),
    queryFn: getSuggestedPeople,
    enabled: false,
  });
}

export function useSendConnectionRequest() {
  return useMutation({ mutationFn: sendConnectionRequest });
}

export function useCancelOutgoingConnectionRequest() {
  return useMutation({ mutationFn: cancelOutgoingConnectionRequest });
}

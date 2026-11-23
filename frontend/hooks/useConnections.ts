import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  acceptConnectionRequest,
  followUser,
  getAllConnections,
  getConnectionDetails,
  getConnectionStatistics,
  getFollowingUsers,
  getIncomingConnectionRequests,
  getOutgoingConnectionRequests,
  getRecentConnections,
  rejectConnectionRequest,
  searchUsersAndConnections,
  unfollowUser,
} from '@/services/connections';

export const connectionKeys = {
  all: ['connections'] as const,
  list: () => [...connectionKeys.all, 'list'] as const,
  recent: () => [...connectionKeys.all, 'recent'] as const,
  statistics: () => [...connectionKeys.all, 'statistics'] as const,
  incomingRequests: () => [...connectionKeys.all, 'requests', 'incoming'] as const,
  outgoingRequests: () => [...connectionKeys.all, 'requests', 'outgoing'] as const,
  following: () => [...connectionKeys.all, 'following'] as const,
  search: (query: string) => [...connectionKeys.all, 'search', query] as const,
  detail: (userId: string) => [...connectionKeys.all, 'detail', userId] as const,
};

export function useConnections() {
  return useQuery({ queryKey: connectionKeys.list(), queryFn: getAllConnections });
}

export function useRecentConnections() {
  return useQuery({ queryKey: connectionKeys.recent(), queryFn: getRecentConnections });
}

export function useConnectionStatistics() {
  return useQuery({
    queryKey: connectionKeys.statistics(),
    queryFn: getConnectionStatistics,
  });
}

export function useIncomingConnectionRequests() {
  return useQuery({
    queryKey: connectionKeys.incomingRequests(),
    queryFn: getIncomingConnectionRequests,
  });
}

export function useOutgoingConnectionRequests() {
  return useQuery({
    queryKey: connectionKeys.outgoingRequests(),
    queryFn: getOutgoingConnectionRequests,
  });
}

export function useFollowingUsers() {
  return useQuery({ queryKey: connectionKeys.following(), queryFn: getFollowingUsers });
}

export function useSearchUsersAndConnections(query: string) {
  const normalizedQuery = query.trim();
  return useQuery({
    queryKey: connectionKeys.search(normalizedQuery),
    queryFn: () => searchUsersAndConnections(normalizedQuery),
    enabled: normalizedQuery.length > 0,
  });
}

export function useConnectionDetails(userId: string) {
  return useQuery({
    queryKey: connectionKeys.detail(userId),
    queryFn: () => getConnectionDetails(userId),
    enabled: Boolean(userId),
  });
}

export function useAcceptConnectionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptConnectionRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}

export function useRejectConnectionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectConnectionRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: followUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}

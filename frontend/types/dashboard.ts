export type DashboardData = {
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
  };
  level?: {
    number?: number | null;
    name?: string | null;
    description?: string | null;
    progress?: number | null;
    nextLevel?: {
      number?: number | null;
      name?: string | null;
    } | null;
  };
  stats?: {
    skills?: number | null;
    projects?: number | null;
    achievements?: number | null;
    connections?: number | null;
  };
};

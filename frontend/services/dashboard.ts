import { requestApi } from '@/services/api';
import type { DashboardData } from '@/types/dashboard';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined;
}

function optionalString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function optionalNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

export async function getDashboard(): Promise<DashboardData> {
  const payload = asRecord(
    await requestApi<unknown>('/api/users/me/dashboard'),
  );

  if (!payload) {
    throw new Error('The dashboard API returned an invalid response.');
  }

  const user = asRecord(payload.user);
  const level = asRecord(payload.level);
  const nextLevel = asRecord(level?.nextLevel);
  const stats = asRecord(payload.stats);

  return {
    user: user
      ? {
          firstName: optionalString(user.firstName),
          lastName: optionalString(user.lastName),
          name: optionalString(user.name),
          avatar: optionalString(user.avatar),
          avatarUrl: optionalString(user.avatarUrl),
        }
      : undefined,
    level: level
      ? {
          number: optionalNumber(level.number),
          name: optionalString(level.name),
          description: optionalString(level.description),
          progress: optionalNumber(level.progress),
          nextLevel: nextLevel
            ? {
                number: optionalNumber(nextLevel.number),
                name: optionalString(nextLevel.name),
              }
            : undefined,
        }
      : undefined,
    stats: stats
      ? {
          skills: optionalNumber(stats.skills),
          projects: optionalNumber(stats.projects),
          achievements: optionalNumber(stats.achievements),
          connections: optionalNumber(stats.connections),
        }
      : undefined,
  };
}

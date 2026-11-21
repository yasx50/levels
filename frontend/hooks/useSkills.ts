import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { skillsService } from '@/services/skills';
import type { CreateSkillInput, UpdateSkillInput } from '@/types/skills';

export const skillKeys = {
  all: ['skills'] as const,
  list: () => [...skillKeys.all, 'list'] as const,
  detail: (skillId: string) => [...skillKeys.all, 'detail', skillId] as const,
  evidence: (skillId: string) => [...skillKeys.all, 'evidence', skillId] as const,
  people: (skillId: string) => [...skillKeys.all, 'people', skillId] as const,
  statistics: (skillId: string) => [...skillKeys.all, 'statistics', skillId] as const,
  suggestions: (query: string) => [...skillKeys.all, 'suggestions', query] as const,
};

export function useSkills() {
  return useQuery({
    queryKey: skillKeys.list(),
    queryFn: skillsService.listSkills,
  });
}

export function useSkill(skillId: string) {
  return useQuery({
    queryKey: skillKeys.detail(skillId),
    queryFn: () => skillsService.getSkill(skillId),
    enabled: Boolean(skillId),
  });
}

export function useSkillEvidence(skillId: string) {
  return useQuery({
    queryKey: skillKeys.evidence(skillId),
    queryFn: () => skillsService.getEvidence(skillId),
    enabled: Boolean(skillId),
  });
}

export function useSkillPeople(skillId: string) {
  return useQuery({
    queryKey: skillKeys.people(skillId),
    queryFn: () => skillsService.getPeople(skillId),
    enabled: Boolean(skillId),
  });
}

export function useSkillStatistics(skillId: string) {
  return useQuery({
    queryKey: skillKeys.statistics(skillId),
    queryFn: () => skillsService.getStatistics(skillId),
    enabled: Boolean(skillId),
  });
}

export function useSkillSuggestions(query: string) {
  return useQuery({
    queryKey: skillKeys.suggestions(query.trim()),
    queryFn: () => skillsService.searchSkills(query),
    enabled: query.trim().length > 0,
    staleTime: 60_000,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSkillInput) => skillsService.createSkill(input),
    onSuccess: async (skill) => {
      queryClient.setQueryData(skillKeys.detail(skill.id), skill);
      await queryClient.invalidateQueries({ queryKey: skillKeys.list() });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      skillId,
      input,
    }: {
      skillId: string;
      input: UpdateSkillInput;
    }) => skillsService.updateSkill(skillId, input),
    onSuccess: async (skill) => {
      queryClient.setQueryData(skillKeys.detail(skill.id), skill);
      await queryClient.invalidateQueries({ queryKey: skillKeys.list() });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) => skillsService.deleteSkill(skillId),
    onSuccess: async (_, skillId) => {
      queryClient.removeQueries({ queryKey: skillKeys.detail(skillId) });
      await queryClient.invalidateQueries({ queryKey: skillKeys.all });
    },
  });
}

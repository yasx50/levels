import type {
  CreateSkillInput,
  Skill,
  SkillCategory,
  SkillEvidence,
  SkillRecognition,
  SkillStatistics,
  UpdateSkillInput,
} from '@/types/skills';

import { mockSkillsService } from '@/services/skills.mock';

export type SkillSuggestion = {
  name: string;
  category: SkillCategory;
};

export type SkillsService = {
  listSkills: () => Promise<Skill[]>;
  getSkill: (skillId: string) => Promise<Skill | null>;
  createSkill: (input: CreateSkillInput) => Promise<Skill>;
  updateSkill: (skillId: string, input: UpdateSkillInput) => Promise<Skill>;
  deleteSkill: (skillId: string) => Promise<void>;
  getEvidence: (skillId: string) => Promise<SkillEvidence[]>;
  getPeople: (skillId: string) => Promise<SkillRecognition[]>;
  getStatistics: (skillId: string) => Promise<SkillStatistics | null>;
  searchSkills: (query: string) => Promise<SkillSuggestion[]>;
};

// TODO: Implement an adapter with requestApi once backend routes, HTTP methods,
// request/response envelopes, and evidence/people/statistics resource ownership are confirmed.
export const skillsService: SkillsService = mockSkillsService;

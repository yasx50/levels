export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Programming',
  'Design',
  'Data',
  'Product',
  'Other',
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type SkillEvidence = {
  id: string;
  title: string;
  description: string;
  dateAdded: string;
  type: string;
  source?: string;
};

export type SkillRecognition = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  designation?: string | null;
  detail: string;
  dateAdded: string;
};

export type SkillStatistics = {
  acknowledgements: number;
  evidenceItems: number;
  experienceYears: number;
  momentum30Days: number;
};

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  experienceYears: number;
  experienceMonths: number;
  proficiency: ProficiencyLevel;
  acknowledgements: number;
  progress: number;
  description: string;
  evidence: SkillEvidence[];
  people: SkillRecognition[];
  statistics: SkillStatistics;
};

export type CreateSkillInput = {
  name: string;
  category: SkillCategory;
  experienceYears: number;
  experienceMonths: number;
  proficiency: ProficiencyLevel;
  description?: string;
};

export type UpdateSkillInput = Partial<CreateSkillInput>;

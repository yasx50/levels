import type {
  CreateSkillInput,
  ProficiencyLevel,
  Skill,
  SkillCategory,
  SkillEvidence,
  SkillRecognition,
  SkillStatistics,
  UpdateSkillInput,
} from '@/types/skills';

const initialSkills: Skill[] = [
  {
    id: 'skill-react',
    name: 'React',
    category: 'Frontend',
    experienceYears: 4,
    experienceMonths: 2,
    proficiency: 'Advanced',
    acknowledgements: 18,
    progress: 82,
    description: 'Building thoughtful, accessible interfaces for the web.',
    evidence: [
      {
        id: 'evidence-react-design-system',
        title: 'Product design system',
        description: 'Built a reusable component library adopted across three product teams.',
        dateAdded: '2026-10-12',
        type: 'Project',
        source: 'Internal product',
      },
      {
        id: 'evidence-react-dashboard',
        title: 'Analytics dashboard',
        description: 'Shipped a responsive analytics experience used by 2,000+ customers.',
        dateAdded: '2026-09-24',
        type: 'Work',
        source: 'Customer platform',
      },
    ],
    people: [
      {
        id: 'person-olivia',
        name: 'Olivia Chen',
        designation: 'Product Designer',
        detail: 'Recognized your work on the product design system.',
        dateAdded: '2026-10-18',
      },
      {
        id: 'person-marcus',
        name: 'Marcus Lee',
        designation: 'Engineering Lead',
        detail: 'Acknowledged your frontend collaboration.',
        dateAdded: '2026-10-04',
      },
    ],
    statistics: {
      acknowledgements: 18,
      evidenceItems: 2,
      experienceYears: 4,
      momentum30Days: 6,
    },
  },
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    category: 'Programming',
    experienceYears: 3,
    experienceMonths: 6,
    proficiency: 'Advanced',
    acknowledgements: 12,
    progress: 74,
    description: 'Creating reliable applications with expressive types.',
    evidence: [
      {
        id: 'evidence-typescript-migration',
        title: 'Application migration',
        description: 'Led the gradual migration of a customer app to strict TypeScript.',
        dateAdded: '2026-08-08',
        type: 'Project',
        source: 'Customer app',
      },
    ],
    people: [
      {
        id: 'person-jordan',
        name: 'Jordan Park',
        designation: 'Software Engineer',
        detail: 'Recognized your code quality and type safety.',
        dateAdded: '2026-10-02',
      },
    ],
    statistics: {
      acknowledgements: 12,
      evidenceItems: 1,
      experienceYears: 3,
      momentum30Days: 3,
    },
  },
  {
    id: 'skill-product-design',
    name: 'Product Design',
    category: 'Design',
    experienceYears: 2,
    experienceMonths: 0,
    proficiency: 'Intermediate',
    acknowledgements: 7,
    progress: 56,
    description: 'Turning user needs into clear and useful product experiences.',
    evidence: [],
    people: [
      {
        id: 'person-olivia-2',
        name: 'Olivia Chen',
        designation: 'Product Designer',
        detail: 'Acknowledged your thoughtful user research.',
        dateAdded: '2026-09-13',
      },
    ],
    statistics: {
      acknowledgements: 7,
      evidenceItems: 0,
      experienceYears: 2,
      momentum30Days: 2,
    },
  },
];

const suggestedSkills: { name: string; category: SkillCategory }[] = [
  { name: 'React', category: 'Frontend' },
  { name: 'React Native', category: 'Frontend' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Python', category: 'Programming' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Product Design', category: 'Design' },
  { name: 'Data Analysis', category: 'Data' },
  { name: 'SQL', category: 'Data' },
  { name: 'Product Management', category: 'Product' },
];

let skills = initialSkills.map(cloneSkill);

function cloneSkill(skill: Skill): Skill {
  return {
    ...skill,
    evidence: skill.evidence.map((item) => ({ ...item })),
    people: skill.people.map((person) => ({ ...person })),
    statistics: { ...skill.statistics },
  };
}

function getExperienceYears(years: number, months: number) {
  return Math.round((years + months / 12) * 10) / 10;
}

function getProficiencyProgress(proficiency: ProficiencyLevel) {
  const progressByLevel: Record<ProficiencyLevel, number> = {
    Beginner: 25,
    Intermediate: 50,
    Advanced: 75,
    Expert: 95,
  };
  return progressByLevel[proficiency];
}

export const mockSkillsService = {
  async listSkills(): Promise<Skill[]> {
    return skills.map(cloneSkill);
  },

  async getSkill(skillId: string): Promise<Skill | null> {
    const skill = skills.find((item) => item.id === skillId);
    return skill ? cloneSkill(skill) : null;
  },

  async createSkill(input: CreateSkillInput): Promise<Skill> {
    const name = input.name.trim();
    if (skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('You have already added this skill.');
    }

    const skill: Skill = {
      id: `skill-${Date.now()}`,
      name,
      category: input.category,
      experienceYears: input.experienceYears,
      experienceMonths: input.experienceMonths,
      proficiency: input.proficiency,
      acknowledgements: 0,
      progress: getProficiencyProgress(input.proficiency),
      description: input.description?.trim() || 'Add a short description to tell your story.',
      evidence: [],
      people: [],
      statistics: {
        acknowledgements: 0,
        evidenceItems: 0,
        experienceYears: getExperienceYears(input.experienceYears, input.experienceMonths),
        momentum30Days: 0,
      },
    };

    skills = [skill, ...skills];
    return cloneSkill(skill);
  },

  async updateSkill(skillId: string, input: UpdateSkillInput): Promise<Skill> {
    const index = skills.findIndex((skill) => skill.id === skillId);
    if (index < 0) {
      throw new Error('This skill could not be found.');
    }

    const current = skills[index];
    if (
      input.name &&
      skills.some(
        (skill) =>
          skill.id !== skillId &&
          skill.name.toLowerCase() === input.name?.trim().toLowerCase(),
      )
    ) {
      throw new Error('You have already added this skill.');
    }

    const updated: Skill = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      description: input.description?.trim() ?? current.description,
      progress: input.proficiency
        ? getProficiencyProgress(input.proficiency)
        : current.progress,
    };
    const years = updated.experienceYears + updated.experienceMonths / 12;
    updated.statistics = {
      ...updated.statistics,
      experienceYears: Math.round(years * 10) / 10,
    };
    skills[index] = updated;
    return cloneSkill(updated);
  },

  async deleteSkill(skillId: string): Promise<void> {
    if (!skills.some((skill) => skill.id === skillId)) {
      throw new Error('This skill could not be found.');
    }
    skills = skills.filter((skill) => skill.id !== skillId);
  },

  async getEvidence(skillId: string): Promise<SkillEvidence[]> {
    return (
      skills
        .find((skill) => skill.id === skillId)
        ?.evidence.map((item) => ({ ...item })) ?? []
    );
  },

  async getPeople(skillId: string): Promise<SkillRecognition[]> {
    return (
      skills
        .find((skill) => skill.id === skillId)
        ?.people.map((person) => ({ ...person })) ?? []
    );
  },

  async getStatistics(skillId: string): Promise<SkillStatistics | null> {
    const skill = skills.find((item) => item.id === skillId);
    return skill ? { ...skill.statistics } : null;
  },

  async searchSkills(query: string): Promise<{ name: string; category: SkillCategory }[]> {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }
    return suggestedSkills.filter((skill) =>
      skill.name.toLowerCase().includes(normalizedQuery),
    );
  },
};

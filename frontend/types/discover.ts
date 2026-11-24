export type DiscoverPerson = {
  id: string;
  name: string;
  initials: string;
  designation: string;
  level?: number;
  description: string;
  skills: string[];
  avatarUrl?: string;
};

export type DiscoverSkill = {
  id: string;
  name: string;
  category: string;
  peopleCount: number;
  description: string;
  highlight: string;
};

export type DiscoverProject = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  ownerId: string;
  ownerName: string;
  ownerInitials: string;
  contributorCount: number;
};

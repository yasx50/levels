/**
 * Backend contracts for Discover are pending.
 * These functions intentionally make no requests until endpoint and response contracts are provided.
 */

export async function getSuggestedPeople(): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover people API integration is not implemented.');
}

export async function getAllDiscoverablePeople(): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover people API integration is not implemented.');
}

export async function searchDiscoverPeople(_query: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint, method, and response contract are known.
  throw new Error('Discover people search API integration is not implemented.');
}

export async function sendConnectionRequest(_userId: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint, payload, and response contract are known.
  throw new Error('Send connection request API integration is not implemented.');
}

export async function cancelOutgoingConnectionRequest(_userId: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint, payload, and response contract are known.
  throw new Error('Cancel outgoing connection request API integration is not implemented.');
}

export async function getDiscoverUserDetails(_userId: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover user details API integration is not implemented.');
}

export async function getDiscoverableSkills(): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover skills API integration is not implemented.');
}

export async function searchDiscoverSkills(_query: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover skills search API integration is not implemented.');
}

export async function getPeopleAssociatedWithSkill(_skillId: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Skill people API integration is not implemented.');
}

export async function getDiscoverSkillDetails(_skillId: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover skill details API integration is not implemented.');
}

export async function getSuggestedProjects(): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover projects API integration is not implemented.');
}

export async function getAllDiscoverableProjects(): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover projects API integration is not implemented.');
}

export async function searchDiscoverProjects(_query: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover projects search API integration is not implemented.');
}

export async function getDiscoverProjectDetails(_projectId: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover project details API integration is not implemented.');
}

export async function getProjectContributors(_projectId: string): Promise<unknown> {
  // TODO: Implement with the shared API client once the endpoint and response contract are known.
  throw new Error('Discover project contributors API integration is not implemented.');
}

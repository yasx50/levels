// Temporary presentation model for the Connections screen; not a backend contract.
export type MockConnection = {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  bio: string;
  connectedAt: string;
  lastActive: string;
  mutualConnections: number;
  color: string;
};

export type MockConnectionRequest = MockConnection & {
  requestedAt: string;
};

export type MockConnectionData = {
  connections: MockConnection[];
  incomingRequests: MockConnectionRequest[];
  outgoingRequests: MockConnectionRequest[];
  followingIds: string[];
  suggestions: MockConnection[];
};

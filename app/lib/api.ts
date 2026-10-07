function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In the browser, always use relative '/api' so it talks directly to the current domain/IP
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return 'http://localhost:4000/api';
}

const API_BASE = getApiBase();

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gv_token');
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gv_token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gv_token');
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  register: (body: any) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => apiRequest('/auth/me'),

  // Wallet
  getWallet: () => apiRequest('/wallet'),
  deposit: (amount: number, paymentMethod?: string, reference?: string) =>
    apiRequest('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod, reference }),
    }),
  verifyPaystack: (reference: string, amount?: number) =>
    apiRequest('/wallet/verify-paystack', {
      method: 'POST',
      body: JSON.stringify({ reference, amount }),
    }),
  withdraw: (amount: number, destination?: string) =>
    apiRequest('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, destination }),
    }),
  getTransactions: () => apiRequest('/wallet/transactions'),

  // Matches
  getOpenMatches: () => apiRequest('/matches/open'),
  getMyActiveMatches: () => apiRequest('/matches/my-active'),
  getMatchById: (matchId: string) => apiRequest(`/matches/${matchId}`),
  createMatch: (data: {
    platform: string;
    stakeAmount: number;
    format?: string;
    teamRules?: string;
  }) => apiRequest('/matches', { method: 'POST', body: JSON.stringify(data) }),
  acceptMatch: (matchId: string) =>
    apiRequest(`/matches/${matchId}/accept`, { method: 'POST' }),
  setLobbyCode: (matchId: string, code: string) =>
    apiRequest(`/matches/${matchId}/lobby-code`, { method: 'POST', body: JSON.stringify({ code }) }),
  submitScore: (matchId: string, score: string, outcome?: string) =>
    apiRequest(`/matches/${matchId}/score`, {
      method: 'POST',
      body: JSON.stringify({ score, outcome }),
    }),
  disputeMatch: (matchId: string, reason: string, evidenceUrl?: string) =>
    apiRequest(`/matches/${matchId}/dispute`, {
      method: 'POST',
      body: JSON.stringify({ reason, evidenceUrl }),
    }),
  cancelMatch: (matchId: string) =>
    apiRequest(`/matches/${matchId}`, { method: 'DELETE' }),

  // Tournaments
  getTournaments: (status?: string) =>
    apiRequest(`/tournaments${status ? `?status=${status}` : ''}`),
  getTournamentById: (id: string) => apiRequest(`/tournaments/${id}`),
  createTournament: (data: any) =>
    apiRequest('/tournaments', { method: 'POST', body: JSON.stringify(data) }),
  joinTournament: (id: string, selectedTeam?: string) =>
    apiRequest(`/tournaments/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ selectedTeam }),
    }),

  // Leaderboard
  getLeaderboard: (platform?: string) =>
    apiRequest(`/leaderboard${platform ? `?platform=${platform}` : ''}`),

  uploadEvidence: async (matchId: string, files: File[], reason?: string) => {
    const token = getAuthToken();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (reason) {
      formData.append('reason', reason);
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/matches/${matchId}/dispute/evidence`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || `Upload failed with status ${response.status}`);
    }
    return data;
  },

  // Admin
  getAdminOverview: () => apiRequest('/admin/overview'),
  getAdminPlayers: () => apiRequest('/admin/players'),
  getAdminMatches: () => apiRequest('/admin/matches'),
  getAdminDisputes: () => apiRequest('/admin/disputes'),
  getAdminTransactions: () => apiRequest('/admin/transactions'),
  getAdminTournaments: () => apiRequest('/admin/tournaments'),
  getMatchDuration: () => apiRequest('/admin/match-duration'),
  setMatchDuration: (minutes: number) =>
    apiRequest('/admin/match-duration', {
      method: 'POST',
      body: JSON.stringify({ minutes }),
    }),
  getAdminSettings: () => apiRequest('/admin/settings'),
  updateAdminSetting: (key: string, value: string, description?: string) =>
    apiRequest('/admin/settings', {
      method: 'POST',
      body: JSON.stringify({ key, value, description }),
    }),
  resolveDispute: (disputeId: string, winnerId: string, resolutionNotes?: string) =>
    apiRequest('/admin/resolve-dispute', {
      method: 'POST',
      body: JSON.stringify({ disputeId, winnerId, resolutionNotes }),
    }),
  updateUserRole: (userId: string, role: string) =>
    apiRequest('/admin/update-role', {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    }),
  adminCancelMatch: (matchId: string) =>
    apiRequest('/admin/cancel-match', {
      method: 'POST',
      body: JSON.stringify({ matchId }),
    }),
  adminDeleteMatch: (matchId: string) =>
    apiRequest('/admin/delete-match', {
      method: 'POST',
      body: JSON.stringify({ matchId }),
    }),
  adminCancelTournament: (tournamentId: string) =>
    apiRequest('/admin/cancel-tournament', {
      method: 'POST',
      body: JSON.stringify({ tournamentId }),
    }),
  adminDeleteTournament: (tournamentId: string) =>
    apiRequest('/admin/delete-tournament', {
      method: 'POST',
      body: JSON.stringify({ tournamentId }),
    }),
};

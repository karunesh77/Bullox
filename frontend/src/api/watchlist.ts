import api from './axios';

interface Watchlist {
  id: string;
  name: string;
  userId: string;
  symbols: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateWatchlistPayload {
  name: string;
}

interface AddSymbolPayload {
  symbol: string;
}

interface RenameWatchlistPayload {
  name: string;
}

export const watchlistApi = {
  // Create a new watchlist
  createWatchlist: (payload: CreateWatchlistPayload) =>
    api.post<{ data: Watchlist }>('/watchlists', payload),

  // Get all user watchlists
  getUserWatchlists: () =>
    api.get<{ data: Watchlist[] }>('/watchlists'),

  // Get single watchlist by ID
  getWatchlist: (id: string) =>
    api.get<{ data: Watchlist }>(`/watchlists/${id}`),

  // Add symbol to watchlist
  addSymbol: (watchlistId: string, payload: AddSymbolPayload) =>
    api.post<{ data: Watchlist }>(`/watchlists/${watchlistId}/symbols`, payload),

  // Remove symbol from watchlist
  removeSymbol: (watchlistId: string, symbol: string) =>
    api.delete<{ data: Watchlist }>(`/watchlists/${watchlistId}/symbols/${symbol}`),

  // Rename watchlist
  renameWatchlist: (watchlistId: string, payload: RenameWatchlistPayload) =>
    api.patch<{ data: Watchlist }>(`/watchlists/${watchlistId}/rename`, payload),

  // Delete watchlist
  deleteWatchlist: (watchlistId: string) =>
    api.delete<{ data: null }>(`/watchlists/${watchlistId}`),
};

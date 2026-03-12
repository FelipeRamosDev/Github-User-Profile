import type { GithubRepo, GithubUser, RepoSortMode } from "./github";
import type { ReactNode } from "react";

export interface UserDataState {
  user: GithubUser | null;
  userRepos: GithubRepo[];
  page: number;
  hasMore: boolean;
  sortMode: RepoSortMode;
  searchToken: number;
}

export interface UserDataContextValue {
  state: UserDataState;
  loading: boolean;
  error: string | null;
  statusMessage: string;
  fetchUserData: (query: string) => Promise<void>;
  loadMoreRepos: () => Promise<void>;
  setSortMode: (sort: RepoSortMode) => Promise<void>;
}

export interface UserDataProviderProps {
  children: ReactNode;
}

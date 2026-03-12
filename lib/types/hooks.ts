import type { GithubRepoDetails } from "./github";

export interface UseRepoDetailsResult {
  repoData: GithubRepoDetails | null;
  loading: boolean;
  error: string | null;
}

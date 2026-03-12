export type RepoSortMode = "updated" | "stars";

export interface GithubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  followers: number;
  following: number;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks: number;
  open_issues: number;
  size: number;
  updated_at: string;
  owner: {
    login: string;
  };
}

export interface GithubRepoDetails {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

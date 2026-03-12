'use client'

import React, { createContext, useContext, useState } from "react";
import { GithubRepo, GithubUser, RepoSortMode, UserDataContextValue, UserDataProviderProps, UserDataState } from "@/lib/types";

const PER_PAGE = 20;
const userDataStateDefault: UserDataState = {
  user: null,
  userRepos: [],
  page: 1,
  hasMore: false,
  sortMode: "updated",
  searchToken: 0
};
const UserDataContext = createContext<UserDataContextValue | undefined>(undefined);

export function UserDataProvider({ children }: UserDataProviderProps) {
  const [userDataState, setUserState] = useState<UserDataState>(userDataStateDefault);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Search for a user.");

  const fetchRepos = async (username: string, page: number, sortMode: RepoSortMode) => {
    const response = await fetch(
      `/api/github/repos?username=${encodeURIComponent(username)}&page=${page}&sort=${sortMode}`
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found.");
      }

      throw new Error(data?.error || "Unable to fetch repositories.");
    }

    return Array.isArray(data) ? (data as GithubRepo[]) : [];
  };

  const fetchUser = async (query: string) => {
    const response = await fetch(`/api/github/user?username=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found.");
      }

      throw new Error(data?.error || "Unable to fetch user.");
    }

    return data as GithubUser;
  };

  const fetchUserData = async (query: string) => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setError("Please provide a username.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStatusMessage("Loading user and repositories...");

      const [user, repos] = await Promise.all([
        fetchUser(cleanQuery),
        fetchRepos(cleanQuery, 1, userDataState.sortMode)
      ]);

      setUserState((prev) => ({
        ...prev,
        user,
        userRepos: repos,
        page: 1,
        hasMore: repos.length === PER_PAGE,
        searchToken: prev.searchToken + 1
      }));
      setStatusMessage(`Loaded ${repos.length} repositories for ${user.login}.`);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to fetch user data.";
      setError(message);
      setStatusMessage(message);
      setUserState((prev) => ({
        ...prev,
        user: null,
        userRepos: [],
        page: 1,
        hasMore: false
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadMoreRepos = async () => {
    if (!userDataState.user || loading || !userDataState.hasMore) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStatusMessage("Loading more repositories...");

      const nextPage = userDataState.page + 1;
      const nextRepos = await fetchRepos(userDataState.user.login, nextPage, userDataState.sortMode);

      setUserState((prev) => ({
        ...prev,
        page: nextPage,
        userRepos: [...prev.userRepos, ...nextRepos],
        hasMore: nextRepos.length === PER_PAGE
      }));
      setStatusMessage(`Loaded ${nextRepos.length} more repositories.`);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load more repositories.";
      setError(message);
      setStatusMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const setSortMode = async (sortMode: RepoSortMode) => {
    if (!userDataState.user) {
      setUserState((prev) => ({
        ...prev,
        sortMode
      }));
      return;
    }

    if (sortMode === userDataState.sortMode) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStatusMessage(`Sorting repositories by ${sortMode === "updated" ? "recent updates" : "stars"}...`);

      const repos = await fetchRepos(userDataState.user.login, 1, sortMode);

      setUserState((prev) => ({
        ...prev,
        sortMode,
        userRepos: repos,
        page: 1,
        hasMore: repos.length === PER_PAGE
      }));
      setStatusMessage(`Showing repositories sorted by ${sortMode === "updated" ? "recent updates" : "stars"}.`);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to change sort mode.";
      setError(message);
      setStatusMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return <UserDataContext.Provider value={{
    state: userDataState,
    fetchUserData,
    loadMoreRepos,
    setSortMode,
    loading,
    error,
    statusMessage
  }}>
    {children}
  </UserDataContext.Provider>
}

export default function useUserData(): UserDataContextValue {
  const context = useContext(UserDataContext);

  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }

  return context;
}

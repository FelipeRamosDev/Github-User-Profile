'use client'

import React, { createContext, useContext, useState } from "react";

interface GitUser {
  avatar_url: string;
  name: string;
  followers: number;
  following: number;
  html_url: string;
  repos_url: string;
}

interface UserDataContextValue {
  state: UserDataState | null;
  loading: boolean;
  error: any;
  fetchUserData: (query: string) => Promise<void>;
}

interface UserDataState {
  user: GitUser | null;
  userRepos: any[];
}

interface UserDataProviderProps {
  children: React.ReactNode;
}

const userDataStateDefault = { user: null, userRepos: [], repos_url: null };
const UserDataContext = createContext<UserDataContextValue | undefined>(undefined);

export function UserDataProvider({ children }: UserDataProviderProps) {
  const [userDataState, setUserState] = useState<UserDataState>(userDataStateDefault);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  const handleSetUser = (user: any, userRepos: any[]) => {
    setUserState(prev => {
      return {
        ...prev,
        user: {
          avatar_url: user?.avatar_url,
          name: user?.name,
          followers: user?.followers,
          following: user?.following,
          html_url: user?.html_url,
          repos_url: user?.repos_url
        },
        userRepos
      }
    });
  }

  const fetchUserData = async (query: string) => {
    if (!query?.trim()) return;

    try {
      setLoading(true);

      const res = await Promise.all([
        fetch(`/api/github/user?username=${query}`),
        fetch(`/api/github/repos?username=${query}`)
      ]);

      const [user, repos] = await Promise.all(res.map(item => item.json()));
      handleSetUser(user, repos);
    } catch (err: any) {
      setError(err?.error);
    } finally {
      setLoading(false);
    }
  }

  return <UserDataContext.Provider value={{
    state: userDataState,
    fetchUserData,
    loading,
    error
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

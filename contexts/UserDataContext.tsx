'use client'

import React, { createContext, useContext, useState } from "react";

interface GitUser {
  login: string;
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
    if (!user) return;
    const { login, avatar_url, name, followers, following, html_url, repos_url } = user;

    setUserState(prev => {
      return {
        ...prev,
        userRepos,
        user: {
          login,
          avatar_url,
          name,
          followers,
          following,
          html_url,
          repos_url
        }
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
      const error = user.error || repos.error;

      if (error) {
        setError(error)
        return;
      }

      handleSetUser(user, repos);
    } catch {
      setError('An error occured trying to fetch the user data!');
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

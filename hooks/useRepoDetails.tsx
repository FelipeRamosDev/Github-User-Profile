'use client';

import { useEffect, useState } from 'react';
import { GithubRepoDetails, UseRepoDetailsResult } from '@/lib/types';

export default function useRepoDetails(owner: string, repo: string): UseRepoDetailsResult {
  const [repoData, setRepoData] = useState<GithubRepoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cleanOwner = owner.trim();
    const cleanRepo = repo.trim();

    if (!cleanOwner || !cleanRepo) {
      setRepoData(null);
      setError('Owner and repository are required.');
      return;
    }

    // Setting isActive to prevent run de script when the component is not maounted
    let isActive = true;

    const fetchRepoDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/github/repo-details?username=${encodeURIComponent(cleanOwner)}&reponame=${encodeURIComponent(cleanRepo)}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Repository not found. Check owner/repo and try again.');
          }

          throw new Error(data?.error || `GitHub request failed with status ${response.status}.`);
        }

        if (isActive) {
          setRepoData(data as GithubRepoDetails);
        }
      } catch (requestError) {
        if (isActive) {
          const message = requestError instanceof Error ? requestError.message : 'Unable to load repository details.';

          setError(message);
          setRepoData(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchRepoDetails();

    return () => {
      isActive = false;
    };
  }, [owner, repo]);

  return {
    repoData,
    loading,
    error
  };
}

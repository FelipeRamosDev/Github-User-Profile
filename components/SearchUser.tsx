'use client'

import useUserData from "@/contexts/UserDataContext";
import React, { useEffect, useState } from "react";

export default function SearchUser() {
  const [ query, setQuery ] = useState<string>('');
  const { loading, error, fetchUserData, state, statusMessage } = useUserData();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    setQuery(value);
  }

  const handleSubmit = async (ev: React.SubmitEvent<HTMLFormElement>) => {
    ev.preventDefault();
    await fetchUserData(query);
  }

  useEffect(() => {
    if (!state.user) {
      return;
    }

    const resultsRegion = document.getElementById('results-region');
    resultsRegion?.focus();
  }, [state.searchToken, state.user]);

  return <div className="SearchUser">
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={query}
          onChange={handleChange}
          autoComplete="username"
          required
          aria-describedby="username-help"
          placeholder="Enter a GitHub username."
        />
        <p id="username-help">Type a GitHub username and submit to load profile and repositories.</p>
      </div>

      <button type="submit" disabled={loading || !query.trim()}>
        {loading ? 'Searching...' : 'Search user'}
      </button>

      <div role="status" aria-live="polite" aria-atomic="true">
        <p>{statusMessage}</p>
      </div>

      {error && <p role="alert">{error}</p>}
    </form>
  </div>;
}
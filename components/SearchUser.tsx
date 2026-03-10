'use client'

import useUserData from "@/contexts/UserDataContext";
import React, { useState } from "react";

export default function SearchUser() {
  const [ query, setQuery ] = useState<string>('');
  const { loading, error, fetchUserData } = useUserData();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    setQuery(value);
  }

  const handleSubmit = async (ev: React.SubmitEvent<HTMLFormElement>) => {
    ev.preventDefault();
    fetchUserData(query);
  }

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
          aria-invalid={Boolean(error)}
          placeholder="Enter a GitHub username."
        />
      </div>

      <button type="submit" disabled={loading || !query.trim()}>
        {loading ? 'Searching...' : 'Search user'}
      </button>

      <div role="status" aria-live="polite" aria-atomic="true">
        {loading && <p>Loading user data...</p>}
      </div>

      {error && <p role="alert">{error}</p>}
    </form>
  </div>;
}
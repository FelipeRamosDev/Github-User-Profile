'use client'

import useUserData from "@/contexts/UserDataContext";

export default function UserBadge() {
  const { state } = useUserData();

  if (!state?.user) {
    return <p role="status" aria-live="polite">Search for a user.</p>
  }

  const userName = state.user.name || "GitHub user";

  return <div className="UserBadge">
    <div className="image-wrap">
      <img
        alt={`${userName} avatar`}
        src={state.user.avatar_url}
        width={100}
        height={100}
        loading="lazy"
      />
    </div>

    <div className="user-data">
      <div aria-label="Name">
        <label>Name:</label>
        <span>{state.user.name || "Not provided"}</span>
      </div>

      <div aria-label="Followers / Following">
        <label>Followers / Following:</label>
        <span>{state.user.followers} / {state.user.following}</span>
      </div>

      <a href={state.user.html_url} aria-label={`View ${userName} profile on GitHub`}>
        View profile on GitHub
      </a>
    </div>
  </div>
}
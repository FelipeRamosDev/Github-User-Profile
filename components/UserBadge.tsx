'use client'

import useUserData from "@/contexts/UserDataContext";

export default function UserBadge() {
  const { state } = useUserData();

  if (!state?.user) {
    return <p role="status" aria-live="polite">Search for a user.</p>
  }

  const userName = state.user.name || state.user.login;

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
      <dl>
        <div>
          <dt>Name</dt>
          <dd>{state.user.name || state.user.login}</dd>
        </div>

        <div>
          <dt>Followers / Following</dt>
          <dd>{state.user.followers} / {state.user.following}</dd>
        </div>
      </dl>

      <a href={state.user.html_url} aria-label={`View ${userName} profile on GitHub`}>
        View profile on GitHub
      </a>
    </div>
  </div>
}
'use client';

import useUserData from "@/contexts/UserDataContext"

export default function ReposList() {
  const { state } = useUserData();

  if (!state?.user) {
    return <p role="status" aria-live="polite">Search for a user to see the repositories list.</p>
  }

  if (!Array.isArray(state?.userRepos)) {
    return <p role="status" aria-live="polite">Repositories list is not available.</p>
  }

  if (state.userRepos.length === 0) {
    return <p role="status" aria-live="polite">No repositories found for this user.</p>
  }

  const repos = state.userRepos;

  return <div className="RepoList">
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Stars</th>
          <th scope="col">Forks</th>
          <th scope="col">Open issues</th>
          <th scope="col">Last updated</th>
          <th scope="col">Repository link</th>
        </tr>
      </thead>
      <tbody>
        {repos.map((item) => (
          <tr key={item.id || item.html_url || item.name}>
            <th scope="row"><a href={`/repo/FelipeRamosDev/${item.name}`}>{item.name || 'Unnamed repository'}</a></th>
            <td>{item.description || 'No description provided.'}</td>
            <td>{item.stargazers_count}</td>
            <td>{item.forks}</td>
            <td>{item.open_issues}</td>
            <td>
              {item.updated_at ? (
                <time dateTime={item.updated_at}>{new Date(item.updated_at).toLocaleString()}</time>
              ) : (
                'Unknown'
              )}
            </td>
            <td>
              {item.html_url ? (
                <a href={item.html_url} aria-label={`Open ${item.name || 'repository'} on GitHub`}>
                  View on GitHub
                </a>
              ) : (
                'Link unavailable'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}

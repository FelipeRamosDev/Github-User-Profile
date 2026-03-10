// Repo details page (intentionally minimal starter)
// TODO (2-hr scope): Fetch repo details from GitHub and render stats + links.
// Hint: https://api.github.com/repos/{owner}/{repo}

'use client';

import useRepoDetails from "@/hooks/useRepoDetails";

type PageProps = {
  params: { owner: string; repo: string };
};

export default function RepoPage({ params }: PageProps) {
  const { owner, repo } = params;
  const { repoData, loading, error } = useRepoDetails(owner, repo);
  const isSuccess = repoData && !loading && !error;
  const isLoading = loading && !error;

  return (
    <main id="main" className="container">
      <header className="header">
        <h1>Repo Details</h1>
        <a href="/">Back to homepage</a>
      </header>

      {isLoading && (
        <p role="status" aria-live="polite" aria-atomic="true">Loading...</p>
      )}

      {error && (
        <p role="alert">{error}</p>
      )}

      {isSuccess && <section className="card">
        <h2 id="repo-details-title">{repoData.full_name}</h2>

        <p>{repoData.description || 'No description provided.'}</p>

        <div>
          <label>Language</label>
          <p>{repoData.language || 'Not specified'}</p>

          <label>Default branch</label>
          <p>{repoData.default_branch}</p>

          <label>Stars</label>
          <p>{repoData.stargazers_count}</p>

          <label>Watchers</label>
          <p>{repoData.watchers_count}</p>

          <label>Forks</label>
          <p>{repoData.forks_count}</p>

          <label>Open issues</label>
          <p>{repoData.open_issues_count}</p>

          <label>Created</label>
          <p>
            <time dateTime={repoData.created_at}>{new Date(repoData.created_at).toLocaleString()}</time>
          </p>

          <label>Last updated</label>
          <p>
            <time dateTime={repoData.updated_at}>{new Date(repoData.updated_at).toLocaleString()}</time>
          </p>

          <label>Last push</label>
          <p>
            <time dateTime={repoData.pushed_at}>{new Date(repoData.pushed_at).toLocaleString()}</time>
          </p>
        </div>

        <p>
          <a href={repoData.html_url} target="_blank" rel="noreferrer">
            Open repository on GitHub
          </a>
        </p>

        {repoData.homepage && (
          <p>
            <a href={repoData.homepage} target="_blank" rel="noreferrer">
              Visit project homepage
            </a>
          </p>
        )}
      </section>}
    </main>
  );
}
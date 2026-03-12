// Repo details page (intentionally minimal starter)
// TODO (2-hr scope): Fetch repo details from GitHub and render stats + links.
// Hint: https://api.github.com/repos/{owner}/{repo}

'use client';

import useRepoDetails from "@/hooks/useRepoDetails";
import { RepoPageProps } from "@/lib/types";

export default function RepoPage({ params }: RepoPageProps) {
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

        <dl>
          <dt>Language</dt>
          <dd>{repoData.language || 'Not specified'}</dd>

          <dt>Default branch</dt>
          <dd>{repoData.default_branch}</dd>

          <dt>Stars</dt>
          <dd>{repoData.stargazers_count}</dd>

          <dt>Watchers</dt>
          <dd>{repoData.watchers_count}</dd>

          <dt>Forks</dt>
          <dd>{repoData.forks_count}</dd>

          <dt>Open issues</dt>
          <dd>{repoData.open_issues_count}</dd>

          <dt>Created</dt>
          <dd>
            <time dateTime={repoData.created_at}>{new Date(repoData.created_at).toLocaleString()}</time>
          </dd>

          <dt>Last updated</dt>
          <dd>
            <time dateTime={repoData.updated_at}>{new Date(repoData.updated_at).toLocaleString()}</time>
          </dd>

          <dt>Last push</dt>
          <dd>
            <time dateTime={repoData.pushed_at}>{new Date(repoData.pushed_at).toLocaleString()}</time>
          </dd>
        </dl>

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
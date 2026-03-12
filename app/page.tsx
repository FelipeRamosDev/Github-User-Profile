import ReposList from "@/components/RepoList";
import SearchUser from "@/components/SearchUser";
import UserBadge from "@/components/UserBadge";
import { UserDataProvider } from "@/contexts/UserDataContext";

export default function HomePage() {
    return (
      <UserDataProvider>
        <main id="main" className="main-content">
          <h1>GitHub Profile Explorer</h1>
          <p>
            Starter project for the frontend coding challenge. Follow README.md.
          </p>
    
          <hr />
    
          {/* TODO: Candidate implements SearchUser component */}
          <section aria-label="Search section">
            <h2>Search</h2>
            <SearchUser />
          </section>
    
          <section aria-label="Results section" id="results-region" tabIndex={-1}>
            <h2>User</h2>
            <UserBadge />

            <h2>Repositories</h2>
            <ReposList />
          </section>
        </main>
      </UserDataProvider>
    );
  }
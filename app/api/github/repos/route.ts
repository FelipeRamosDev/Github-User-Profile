import { NextResponse } from "next/server";
import { githubHeaders, parseJsonSafely } from "@/lib/github";

const PER_PAGE = 20;
const GITHUB_PAGE_SIZE = 100;

async function fetchAllRepos(username: string) {
  const repos: unknown[] = [];

  for (let page = 1; page <= 10; page += 1) {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=${GITHUB_PAGE_SIZE}&page=${page}&sort=updated`,
      {
        headers: githubHeaders(),
        next: { revalidate: 60 }
      }
    );

    const data = await parseJsonSafely(res);

    if (!res.ok) {
      return { error: true as const, status: res.status, data };
    }

    const pageItems = Array.isArray(data) ? data : [];
    repos.push(...pageItems);

    if (pageItems.length < GITHUB_PAGE_SIZE) {
      break;
    }
  }

  return { error: false as const, repos };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "").trim();
  const pageParam = Number(searchParams.get("page") || "1");
  const sort = (searchParams.get("sort") || "updated").trim();

  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const sortMode = sort === "stars" ? "stars" : "updated";

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    if (sortMode === "updated") {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=${PER_PAGE}&page=${page}&sort=updated`,
        {
          headers: githubHeaders(),
          next: { revalidate: 60 }
        }
      );

      const data = await parseJsonSafely(res);

      if (!res.ok) {
        return NextResponse.json(
          { error: "Unable to fetch repositories", status: res.status },
          { status: res.status === 404 ? 404 : 502 }
        );
      }

      return NextResponse.json(data);
    }

    const allReposResult = await fetchAllRepos(username);

    if (allReposResult.error) {
      return NextResponse.json(
        { error: "Unable to fetch repositories", status: allReposResult.status },
        { status: allReposResult.status === 404 ? 404 : 502 }
      );
    }

    const sorted = [...allReposResult.repos].sort((a: any, b: any) => {
      const left = Number(a?.stargazers_count || 0);
      const right = Number(b?.stargazers_count || 0);
      return right - left;
    });

    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;

    return NextResponse.json(sorted.slice(start, end));
  } catch {
    return NextResponse.json({ error: "Network failure" }, { status: 502 });
  }
}
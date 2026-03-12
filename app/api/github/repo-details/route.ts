import { NextResponse } from "next/server";
import { githubHeaders, parseJsonSafely } from "@/lib/github";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "").trim();
  const reponame = (searchParams.get("reponame") || "").trim();

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  if (!reponame) {
    return NextResponse.json({ error: "reponame is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(reponame)}`, {
      headers: githubHeaders(),
      next: { revalidate: 60 }
    });

    const data = await parseJsonSafely(res);

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "Unable to fetch user repository", status: res.status },
        { status: res.status === 404 ? 404 : 502 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network failure" }, { status: 502 });
  }
}
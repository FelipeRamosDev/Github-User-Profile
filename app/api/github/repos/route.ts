import { NextResponse } from "next/server";
import { githubHeaders, parseJsonSafely } from "@/lib/github";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "").trim();

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos`, {
      headers: githubHeaders(),
      next: { revalidate: 60 }
    });

    const data = await parseJsonSafely(res);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Unable to fetch user", status: res.status },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network failure" }, { status: 502 });
  }
}
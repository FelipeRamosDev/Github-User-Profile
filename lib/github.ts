export function githubHeaders() {
    const token = process.env.GITHUB_TOKEN;
    return {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }
  
  export async function parseJsonSafely(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
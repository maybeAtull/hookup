export interface RepoSlug {
  readonly owner: string;
  readonly repo: string;
}

export function parseRepoSlug(repoUrl: string): RepoSlug | null {
  try {
    const { hostname, pathname } = new URL(repoUrl);
    if (hostname !== "github.com") return null;

    const [owner, repo] = pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;

    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

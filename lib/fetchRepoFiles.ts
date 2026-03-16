import type { FileContent } from "./analyzeCodebase";

const ALLOWED_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".go", ".java", ".rs", ".rb", ".php", ".cs",
  ".swift", ".kt", ".scala", ".c", ".cpp", ".h",
]);

const SKIP_DIRS = new Set([
  "node_modules", "dist", "build", ".git", "vendor",
  ".next", "__pycache__", ".cache", "coverage",
]);

const SKIP_FILES = new Set([
  "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  ".DS_Store", "Thumbs.db",
]);

interface GitHubTreeItem {
  path: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

function isAllowedFile(path: string): boolean {
  const parts = path.split("/");
  // Skip if any directory segment is in the skip list
  for (let i = 0; i < parts.length - 1; i++) {
    if (SKIP_DIRS.has(parts[i])) return false;
  }

  const fileName = parts[parts.length - 1];
  if (SKIP_FILES.has(fileName)) return false;
  if (fileName.startsWith(".")) return false;

  const ext = "." + fileName.split(".").pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

export async function fetchRepoFiles(
  owner: string,
  repo: string,
  accessToken: string,
  branch = "main"
): Promise<FileContent[]> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github.v3+json",
  };

  // Try main branch, fall back to master
  let treeData: { tree: GitHubTreeItem[] };
  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers }
    );

    if (!treeRes.ok && branch === "main") {
      // Try master branch
      const masterRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`,
        { headers }
      );
      if (!masterRes.ok) throw new Error(`Failed to fetch repo tree: ${masterRes.statusText}`);
      treeData = await masterRes.json();
    } else if (!treeRes.ok) {
      throw new Error(`Failed to fetch repo tree: ${treeRes.statusText}`);
    } else {
      treeData = await treeRes.json();
    }
  } catch (err) {
    throw new Error(`Cannot access repository: ${err instanceof Error ? err.message : String(err)}`);
  }

  const eligibleFiles = treeData.tree
    .filter((item) => item.type === "blob" && isAllowedFile(item.path) && (item.size ?? 0) < 200_000)
    .slice(0, 50);

  const files: FileContent[] = [];

  await Promise.all(
    eligibleFiles.map(async (item) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`,
          { headers }
        );
        if (!res.ok) return;

        const data = await res.json();
        if (data.encoding === "base64" && data.content) {
          const content = Buffer.from(data.content, "base64").toString("utf-8");
          files.push({ name: item.path, content });
        }
      } catch {
        // Skip unreadable files
      }
    })
  );

  return files;
}

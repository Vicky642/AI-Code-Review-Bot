import parseDiff, { File } from 'parse-diff';

export async function fetchPullRequestDiff(
  octokit: any,
  owner: string,
  repo: string,
  prNumber: number
): Promise<File[]> {
  const response = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: {
      format: 'diff',
    },
  });

  const diffStr = response.data as unknown as string;
  const files = parseDiff(diffStr);

  // Filter out deleted files or unreviewable files (like binaries or locks)
  return files.filter(file => {
    if (file.deleted) return false;
    const fileName = file.to || file.from || '';
    if (fileName.endsWith('.lock') || fileName.includes('package-lock.json')) return false;
    // Add more exclusions as needed
    return true;
  });
}

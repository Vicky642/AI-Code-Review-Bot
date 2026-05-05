export interface ReviewComment {
  path: string;
  start_line?: number;
  line: number;
  body: string;
}

export async function postComments(
  octokit: any,
  owner: string,
  repo: string,
  prNumber: number,
  commitId: string,
  comments: ReviewComment[]
): Promise<void> {
  // We should fetch existing comments to avoid duplicates
  const existingCommentsResponse = await octokit.rest.pulls.listReviewComments({
    owner,
    repo,
    pull_number: prNumber,
  });
  const existingComments = existingCommentsResponse.data;

  for (const comment of comments) {
    // Basic deduplication: check if same file, line, and body exists
    const isDuplicate = existingComments.some(
      (ec: any) =>
        ec.path === comment.path &&
        ec.line === comment.line &&
        ec.body === comment.body
    );

    if (isDuplicate) {
      continue;
    }

    try {
      const payload: any = {
        owner,
        repo,
        pull_number: prNumber,
        commit_id: commitId,
        path: comment.path,
        line: comment.line,
        side: 'RIGHT',
        body: comment.body,
      };

      if (comment.start_line && comment.start_line < comment.line) {
        payload.start_line = comment.start_line;
        payload.start_side = 'RIGHT';
      }

      await octokit.rest.pulls.createReviewComment(payload);
    } catch (err: any) {
      console.warn(`Failed to post comment on ${comment.path} at line ${comment.line}:`, err.message);
    }
  }
}

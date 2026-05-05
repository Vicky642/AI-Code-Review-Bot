export interface ReviewComment {
    path: string;
    start_line?: number;
    line: number;
    body: string;
}
export declare function postComments(octokit: any, owner: string, repo: string, prNumber: number, commitId: string, comments: ReviewComment[]): Promise<void>;

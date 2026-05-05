import { File } from 'parse-diff';
export declare function fetchPullRequestDiff(octokit: any, owner: string, repo: string, prNumber: number): Promise<File[]>;

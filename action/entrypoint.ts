import * as core from '@actions/core';
import * as github from '@actions/github';
import { fetchPullRequestDiff } from './pr-fetcher';
import { orchestrateReview } from '../engine/review-orchestrator';
import { postComments } from './comment-poster';

async function run(): Promise<void> {
  try {
    const token = core.getInput('github_token');
    const providerName = core.getInput('provider');
    const openaiKey = core.getInput('openai_key');
    const anthropicKey = core.getInput('anthropic_key');

    const context = github.context;
    
    if (context.eventName !== 'pull_request') {
      core.info('ReviewMind only runs on pull_request events.');
      return;
    }

    const prNumber = context.payload.pull_request?.number;
    if (!prNumber) {
      throw new Error('Could not find PR number in payload.');
    }

    const octokit = github.getOctokit(token);

    core.info(`Fetching diff for PR #${prNumber}...`);
    const diffFiles = await fetchPullRequestDiff(octokit, context.repo.owner, context.repo.repo, prNumber);

    if (diffFiles.length === 0) {
      core.info('No files to review.');
      return;
    }

    core.info(`Reviewing ${diffFiles.length} files using ${providerName}...`);
    
    // Orchestrate the review (calls LLM)
    const reviewComments = await orchestrateReview(diffFiles, {
      providerName,
      openaiKey,
      anthropicKey
    });

    core.info(`Found ${reviewComments.length} review comments. Posting to PR...`);
    
    await postComments(octokit, context.repo.owner, context.repo.repo, prNumber, context.payload.pull_request?.head.sha || '', reviewComments);

    core.info('Review completed successfully!');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`ReviewMind failed: ${error.message}`);
    } else {
      core.setFailed('ReviewMind failed with an unknown error');
    }
  }
}

run();

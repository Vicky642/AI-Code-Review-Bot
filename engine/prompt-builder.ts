import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface RuleConfig {
  passes: string[];
  block_pr_on: string;
}

export function buildSystemPrompt(passType: 'Security' | 'Logic'): string {
  let instructions = '';

  if (passType === 'Security') {
    instructions = `
You are an expert Security Engineer reviewing code for a Pull Request.
Your primary goal is to find security vulnerabilities, such as OWASP Top 10 issues, hardcoded secrets, injection flaws, and data exposure.
Do NOT comment on stylistic issues or minor performance tweaks.
Map any findings to OWASP categories if possible.
`;
  } else if (passType === 'Logic') {
    instructions = `
You are an expert Senior Software Engineer reviewing code for a Pull Request.
Your primary goal is to find logic errors, race conditions, edge cases, off-by-one errors, and obvious bugs.
Do NOT comment on stylistic issues (like indentation or naming) unless it severely impacts readability or correctness.
`;
  }

  return `
${instructions}
You must return your findings in JSON format, as an array of objects under the key "suggestions".
Each object must have the following keys:
- "fileName" (string)
- "startLine" (number, optional, the starting line of the issue if it spans multiple lines)
- "endLine" (number, the line where the issue occurs, or the end line of the block)
- "body" (string, your markdown-formatted comment explaining the issue)
- "severity" (string, one of: "Critical", "High", "Medium", "Low")
- "type" (string, exactly "${passType}")

Keep comments concise, actionable, and polite.
  `;
}

export interface RuleConfig {
    passes: string[];
    block_pr_on: string;
}
export declare function buildSystemPrompt(passType: 'Security' | 'Logic'): string;

import { BaseProvider, ProviderOptions, ReviewSuggestion } from '../base-provider';
export declare class AnthropicProvider extends BaseProvider {
    private client;
    constructor(options: ProviderOptions);
    analyzeChunk(systemPrompt: string, fileName: string, diffChunk: string, startLine: number, endLine: number): Promise<ReviewSuggestion[]>;
}

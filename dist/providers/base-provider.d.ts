export interface ReviewSuggestion {
    fileName: string;
    startLine?: number;
    endLine: number;
    body: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    type: 'Security' | 'Logic' | 'Style' | 'Performance' | 'Documentation';
}
export interface ProviderOptions {
    apiKey?: string;
    model?: string;
}
export declare abstract class BaseProvider {
    protected apiKey: string;
    protected model: string;
    constructor(options: ProviderOptions);
    /**
     * Analyzes a code chunk and returns an array of suggestions.
     */
    abstract analyzeChunk(systemPrompt: string, fileName: string, diffChunk: string, startLine: number, endLine: number): Promise<ReviewSuggestion[]>;
}

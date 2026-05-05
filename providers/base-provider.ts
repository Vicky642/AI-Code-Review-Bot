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

export abstract class BaseProvider {
  protected apiKey: string;
  protected model: string;

  constructor(options: ProviderOptions) {
    if (!options.apiKey) {
      throw new Error('API key is required for provider');
    }
    this.apiKey = options.apiKey;
    this.model = options.model || '';
  }

  /**
   * Analyzes a code chunk and returns an array of suggestions.
   */
  abstract analyzeChunk(
    systemPrompt: string,
    fileName: string,
    diffChunk: string,
    startLine: number,
    endLine: number
  ): Promise<ReviewSuggestion[]>;
}

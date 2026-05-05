import { OpenAI } from 'openai';
import { BaseProvider, ProviderOptions, ReviewSuggestion } from '../base-provider';

export class OpenAIProvider extends BaseProvider {
  private client: OpenAI;

  constructor(options: ProviderOptions) {
    super({ ...options, model: options.model || 'gpt-4o' });
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  async analyzeChunk(
    systemPrompt: string,
    fileName: string,
    diffChunk: string,
    startLine: number,
    endLine: number
  ): Promise<ReviewSuggestion[]> {
    const prompt = `
Please review the following code changes in ${fileName}.
The changes are unified diff format between lines ${startLine} and ${endLine}.
Only provide actionable suggestions. Return your response ONLY as a JSON array of objects.

Diff Chunk:
${diffChunk}
`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message?.content || '{}';
      
      // Attempt to parse JSON containing an array of suggestions
      // OpenAI JSON mode requires the output to be a JSON object, so we assume a wrapper: { "suggestions": [...] }
      const parsed = JSON.parse(content);
      return parsed.suggestions || [];
    } catch (err: any) {
      console.warn(`OpenAI failed to analyze chunk in ${fileName}:`, err.message);
      return [];
    }
  }
}

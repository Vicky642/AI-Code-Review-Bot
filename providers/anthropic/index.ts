import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider, ProviderOptions, ReviewSuggestion } from '../base-provider';

export class AnthropicProvider extends BaseProvider {
  private client: Anthropic;

  constructor(options: ProviderOptions) {
    super({ ...options, model: options.model || 'claude-3-5-sonnet-20240620' });
    this.client = new Anthropic({ apiKey: this.apiKey });
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
Only provide actionable suggestions. Return your response ONLY as a JSON array of objects inside a "suggestions" key.

Example response format:
{
  "suggestions": [
    {
      "fileName": "src/index.ts",
      "startLine": 10,
      "endLine": 12,
      "body": "This could cause a null pointer exception.",
      "severity": "High",
      "type": "Logic"
    }
  ]
}

Diff Chunk:
${diffChunk}
`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
      
      // Extract json from markdown if necessary
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/({[\s\S]*})/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      const parsed = JSON.parse(jsonString);
      return parsed.suggestions || [];
    } catch (err: any) {
      console.warn(`Anthropic failed to analyze chunk in ${fileName}:`, err.message);
      return [];
    }
  }
}

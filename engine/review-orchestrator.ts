import { File } from 'parse-diff';
import { parseDiffChunks } from './diff-parser';
import { buildSystemPrompt } from './prompt-builder';
import { OpenAIProvider } from '../providers/openai';
import { AnthropicProvider } from '../providers/anthropic';
import { BaseProvider } from '../providers/base-provider';
import { ReviewComment } from '../action/comment-poster';

interface OrchestratorOptions {
  providerName: string;
  openaiKey?: string;
  anthropicKey?: string;
}

export async function orchestrateReview(
  files: File[],
  options: OrchestratorOptions
): Promise<ReviewComment[]> {
  const chunks = parseDiffChunks(files);
  const comments: ReviewComment[] = [];

  let provider: BaseProvider;

  if (options.providerName.toLowerCase() === 'openai') {
    provider = new OpenAIProvider({ apiKey: options.openaiKey });
  } else if (options.providerName.toLowerCase() === 'anthropic') {
    provider = new AnthropicProvider({ apiKey: options.anthropicKey });
  } else {
    throw new Error(`Unsupported provider: ${options.providerName}`);
  }

  // We run two passes: Security and Logic
  const passes: ('Security' | 'Logic')[] = ['Security', 'Logic'];

  for (const chunk of chunks) {
    // Run passes in parallel for each chunk
    const passPromises = passes.map(async (pass) => {
      const prompt = buildSystemPrompt(pass);
      return provider.analyzeChunk(prompt, chunk.fileName, chunk.content, chunk.startLine, chunk.endLine);
    });

    const passResults = await Promise.all(passPromises);
    
    // Flatten and map to ReviewComment format
    for (const suggestions of passResults) {
      for (const suggestion of suggestions) {
        comments.push({
          path: suggestion.fileName,
          line: suggestion.endLine,
          start_line: suggestion.startLine !== suggestion.endLine ? suggestion.startLine : undefined,
          body: `**[${suggestion.type} - ${suggestion.severity}]**\n\n${suggestion.body}`,
        });
      }
    }
  }

  return comments;
}

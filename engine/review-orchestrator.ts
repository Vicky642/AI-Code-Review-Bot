import { File } from 'parse-diff';
import { parseDiffChunks } from './diff-parser';
import { buildSystemPrompt } from './prompt-builder';
import { selectProvider } from '../providers/provider-selector';
import { ReviewComment } from '../action/comment-poster';
import { enrichWithOwasp } from '../security/owasp-mapper';

interface OrchestratorOptions {
  providerName: string;
  openaiKey?: string;
  anthropicKey?: string;
  fallbackProviderName?: string;
}

export async function orchestrateReview(
  files: File[],
  options: OrchestratorOptions
): Promise<ReviewComment[]> {
  const chunks = parseDiffChunks(files);
  const comments: ReviewComment[] = [];

  const provider = selectProvider({
    providerName: options.providerName,
    openaiKey: options.openaiKey,
    anthropicKey: options.anthropicKey,
    fallbackProviderName: options.fallbackProviderName,
  });

  // Run two focused passes: Security and Logic
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
        // Enrich security findings with OWASP references
        let body = `**[${suggestion.type} - ${suggestion.severity}]**\n\n${suggestion.body}`;
        if (suggestion.type === 'Security') {
          body = `**[${suggestion.type} - ${suggestion.severity}]**\n\n${enrichWithOwasp(suggestion.body, suggestion.type)}`;
        }

        comments.push({
          path: suggestion.fileName,
          line: suggestion.endLine,
          start_line: (suggestion.startLine && suggestion.startLine < suggestion.endLine)
            ? suggestion.startLine
            : undefined,
          body,
        });
      }
    }
  }

  return comments;
}


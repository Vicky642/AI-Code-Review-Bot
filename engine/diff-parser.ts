import { File, Chunk, Change } from 'parse-diff';

export interface DiffChunk {
  fileName: string;
  content: string;
  startLine: number;
  endLine: number;
}

export function parseDiffChunks(files: File[]): DiffChunk[] {
  const result: DiffChunk[] = [];

  for (const file of files) {
    const fileName = file.to || file.from;
    if (!fileName) continue;

    for (const chunk of file.chunks) {
      // Find the range of lines in this chunk
      const changes = chunk.changes;
      if (changes.length === 0) continue;

      // Extract the line numbers
      let startLine = Number.MAX_SAFE_INTEGER;
      let endLine = -1;

      let chunkContent = chunk.content + '\n';
      for (const change of changes) {
        if (change.type === 'add' || change.type === 'normal') {
          const ln = change.type === 'add' ? change.ln : change.ln2;
          if (ln && ln < startLine) startLine = ln;
          if (ln && ln > endLine) endLine = ln;
        }
        chunkContent += change.content + '\n';
      }

      if (startLine <= endLine) {
        result.push({
          fileName,
          content: chunkContent,
          startLine,
          endLine,
        });
      }
    }
  }

  return result;
}

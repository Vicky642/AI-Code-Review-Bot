import { File } from 'parse-diff';
export interface DiffChunk {
    fileName: string;
    content: string;
    startLine: number;
    endLine: number;
}
export declare function parseDiffChunks(files: File[]): DiffChunk[];

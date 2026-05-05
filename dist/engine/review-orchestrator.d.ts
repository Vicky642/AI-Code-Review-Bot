import { File } from 'parse-diff';
import { ReviewComment } from '../action/comment-poster';
interface OrchestratorOptions {
    providerName: string;
    openaiKey?: string;
    anthropicKey?: string;
    fallbackProviderName?: string;
}
export declare function orchestrateReview(files: File[], options: OrchestratorOptions): Promise<ReviewComment[]>;
export {};

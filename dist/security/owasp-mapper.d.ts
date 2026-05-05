export interface OwaspCategory {
    id: string;
    name: string;
    description: string;
    url: string;
}
/**
 * Maps a security finding to the most relevant OWASP Top 10 category,
 * and appends an educational footer to the comment body.
 */
export declare function enrichWithOwasp(body: string, type: string): string;

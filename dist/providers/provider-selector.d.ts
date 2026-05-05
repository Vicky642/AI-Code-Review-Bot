import { BaseProvider } from './base-provider';
export type ProviderName = 'openai' | 'anthropic';
export interface ProviderSelectorConfig {
    providerName: string;
    openaiKey?: string;
    anthropicKey?: string;
    fallbackProviderName?: string;
}
export declare function selectProvider(config: ProviderSelectorConfig): BaseProvider;

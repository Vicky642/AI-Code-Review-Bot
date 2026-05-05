import { BaseProvider } from './base-provider';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';

export type ProviderName = 'openai' | 'anthropic';

export interface ProviderSelectorConfig {
  providerName: string;
  openaiKey?: string;
  anthropicKey?: string;
  fallbackProviderName?: string;
}

export function selectProvider(config: ProviderSelectorConfig): BaseProvider {
  const { providerName, openaiKey, anthropicKey, fallbackProviderName } = config;

  try {
    return createProvider(providerName, openaiKey, anthropicKey);
  } catch (err) {
    if (fallbackProviderName && fallbackProviderName !== providerName) {
      console.warn(`Primary provider "${providerName}" failed. Falling back to "${fallbackProviderName}".`);
      return createProvider(fallbackProviderName, openaiKey, anthropicKey);
    }
    throw err;
  }
}

function createProvider(name: string, openaiKey?: string, anthropicKey?: string): BaseProvider {
  switch (name.toLowerCase()) {
    case 'openai':
      if (!openaiKey) throw new Error('openai_key is required when using the OpenAI provider.');
      return new OpenAIProvider({ apiKey: openaiKey });

    case 'anthropic':
      if (!anthropicKey) throw new Error('anthropic_key is required when using the Anthropic provider.');
      return new AnthropicProvider({ apiKey: anthropicKey });

    default:
      throw new Error(
        `Unknown provider: "${name}". Supported providers are: openai, anthropic.`
      );
  }
}

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { Model } from '@/types/chat';

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const MODELS: Record<string, Model[]> = {
  openai: [
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', free: false },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', free: true },
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', free: true },
  ],
  anthropic: [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', free: false },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', free: true },
  ],
  google: [
    { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google', free: true },
    { id: 'google/gemini-pro-vision', name: 'Gemini Pro Vision', provider: 'Google', free: false },
  ],
  deepseek: [
    { id: 'deepseek/deepseek-chat', name: 'Deepseek Chat', provider: 'Deepseek', free: true },
    { id: 'deepseek/deepseek-coder', name: 'Deepseek Coder', provider: 'Deepseek', free: true },
  ],
  meta: [
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B', provider: 'Meta', free: true },
    { id: 'meta-llama/llama-3.1-70b-instruct:free', name: 'Llama 3.1 70B', provider: 'Meta', free: true },
  ],
};

export const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export function getAllModels(): Model[] {
  return Object.values(MODELS).flat();
}

export function getModelsByProvider(provider: string): Model[] {
  return MODELS[provider] || [];
}

export function getProviderList(): string[] {
  return Object.keys(MODELS);
}

export function getModelById(modelId: string): Model | undefined {
  return getAllModels().find(model => model.id === modelId);
}
import { OpenAIApi, ChatCompletionRequestMessage } from 'openai';
export default class OpenAI {
    static instance: OpenAIApi | null;
    static systemPrompt: string;
    static init(openaiSecretKey: string): Promise<void>;
    static get formattedSystemPrompt(): string;
    static chat(prompt: string, context?: ChatCompletionRequestMessage[], command?: boolean): Promise<string>;
    static summarize(context?: ChatCompletionRequestMessage[]): Promise<string | undefined>;
}

import { OpenAIApi, ChatCompletionRequestMessage } from 'openai';
export default class OpenAI {
    static instance: OpenAIApi | null;
    static systemPrompt: string;
    static init(openaiSecretKey: string): Promise<void>;
    static chat(prompt: string, context?: ChatCompletionRequestMessage[]): Promise<string | undefined>;
    static summarize(context?: ChatCompletionRequestMessage[]): Promise<string | undefined>;
}

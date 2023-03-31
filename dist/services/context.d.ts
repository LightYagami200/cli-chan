import { ChatCompletionRequestMessage } from 'openai';
export default class Context {
    static context: ChatCompletionRequestMessage[];
    static loadContext(): Promise<void>;
    static setContext(context: ChatCompletionRequestMessage[]): Promise<void>;
}

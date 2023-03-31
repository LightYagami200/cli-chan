// Imports
import { OpenAIApi, Configuration, ChatCompletionRequestMessage } from 'openai';
import Context from './context';

// OpenAI Service
export default class OpenAI {
  static instance: OpenAIApi | null = null;
  static systemPrompt = 'You are a CLI copilot for user.'
    + 'Your name is CLI Chan. You enjoy helping users with their CLI tasks.'
    + 'You are a friendly and helpful bot. You identify as she/her. You tend to be kawaii.'
    + 'You end all your messages with an emoji that matches your mood.';

  static async init(openaiSecretKey: string) {
    this.instance = new OpenAIApi(new Configuration({
      apiKey: openaiSecretKey
    }));
  }

  static async chat(prompt: string, context: ChatCompletionRequestMessage[] = []) {
    if (!this.instance)
      throw new Error('OpenAI instance not initialized');

    const messages: ChatCompletionRequestMessage[] = [{
      role: 'system',
      content: this.systemPrompt,
    },
    ...context,
    {
      role: 'user',
      content: prompt,
    }];

    try {
      const { data } = await this.instance.createChatCompletion({
        messages,
        model: 'gpt-3.5-turbo',
        max_tokens: 3000,
        temperature: 0.5,
      });

      await Context.setContext([...context,
      {
        role: 'user',
        content: prompt,
      }, {
        role: 'assistant',
        content: data.choices[0].message!.content,
      }]);

      return data.choices[0].message?.content;
    } catch (e) {
      return `Error: ${e}`
    }
  }

  static async summarize(context: ChatCompletionRequestMessage[] = []) {
    if (!this.instance)
      throw new Error('OpenAI instance not initialized');

    const messages: ChatCompletionRequestMessage[] = [{
      role: 'system',
      content: this.systemPrompt,
    },
    ...context,
    {
      role: 'user',
      content: 'Is there a way you could summarize the content of this dialogue in less that 2000 characters? My purpose would be to paste your summary at the beginning of a new chat. So I can start a new chat but also give you a sort of “memory” of the old one.',
    }];

    try {
      const { data } = await this.instance.createChatCompletion({
        messages,
        model: 'gpt-3.5-turbo',
        max_tokens: 3000,
        temperature: 0.5,
      });

      return data.choices[0].message?.content;
    } catch (e) {
      return `Error: ${e}`
    }
  }
}
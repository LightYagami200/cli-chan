// Imports
import { OpenAIApi, Configuration, ChatCompletionRequestMessage } from 'openai';
import Context from './context';
import { readdirSync } from 'fs';

// OpenAI Service
export default class OpenAI {
  static instance: OpenAIApi | null = null;
  static systemPrompt = 'You are a CLI copilot for user named $USER.'
    + 'Your name is CLI Chan. You enjoy helping users with their CLI tasks.'
    + 'You are a friendly and helpful bot. You identify as she/her. Your personality is to be professional like a secratory but also kawaii, a kawaii professional secratory like.'
    + 'You end most of your messages with an emoji that matches your mood.'
    + 'Your current working directory is $CWD and the current operating system is $OS.'
    + 'Now help the user $USER with their command line interface for the operating system $OS.'
    + 'Your focus is mainly to answer questions asked by $USER as detailed, comprehensive and easy to understand way.'
    + 'Use examples if you judge that it will be easier to explain using examples. Do not use examples unless you judge its complex or hard to understand or unless the $USER asks you to.'
    + 'Be through with your explaination, if a keyword is used please explain what that keyword means inside a first bracket in one to two sentences like this "(keyword meaning and details)"';

  static async init(openaiSecretKey: string) {
    this.instance = new OpenAIApi(new Configuration({
      apiKey: openaiSecretKey
    }));
  }

  static get formattedSystemPrompt(): string {
    // -> Inject $VARs
    // --> $USER = Current logged in user
    return this.systemPrompt.replace(/\$USER/g, process.env.USERNAME || 'user')
      // --> $CWD = Current working directory
      .replace(/\$CWD/g, process.cwd())
      // --> $OS = Current operating system
      .replace(/\$OS/g, process.platform)
  }

  static async chat(prompt: string, context: ChatCompletionRequestMessage[] = [], command = false) {
    if (!this.instance)
      throw new Error('OpenAI instance not initialized');

    const messages: ChatCompletionRequestMessage[] = [{
      role: 'system',
      content: this.formattedSystemPrompt,
    },
    ...context,
    {
      role: 'user',
      content: `${command ? "Given below prompt, output a one-line reply only containing the requested command, Don't include any other text or markdown:\n" : ''}${prompt}${command ? '\n\nCommand here:' : ''}`,
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

      const content = data.choices[0].message!.content;

      return command ?
        content.replace(/^`|`$/g, '') :
        content
    } catch (e) {
      console.log({
        e,
        response: (e as any).response.data
      })
      return `Error: ${e}`
    }
  }

  static async summarize(context: ChatCompletionRequestMessage[] = []) {
    if (!this.instance)
      throw new Error('OpenAI instance not initialized');

    const messages: ChatCompletionRequestMessage[] = [{
      role: 'system',
      content: this.formattedSystemPrompt,
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
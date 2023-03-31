// Imports
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { ChatCompletionRequestMessage } from 'openai';
import { homedir } from 'os';
import { join } from 'path';
import OpenAI from './openai';

// Context Service
export default class Context {
  static context: ChatCompletionRequestMessage[] = [];

  static async loadContext() {
    // Get config directory
    const dir = join(homedir(), '.cli-chan');

    // Get context file
    const file = join(dir, 'context.json');

    // If file doesn't exist, create it
    if (!existsSync(file))
      await writeFile(file, JSON.stringify(this.context), {
        encoding: 'utf-8',
        mode: 0o600
      });

    // Read context file
    const context = (await import(file)).default;

    // Set context
    this.context = context;
  }

  static async setContext(context: ChatCompletionRequestMessage[]) {
    if (!this.context)
      await this.loadContext();

    // If context is larger than 8000 characters, summarize it
    if (JSON.stringify(context).length > 8000) {
      const summary = await OpenAI.summarize(context);

      console.info({
        summary
      })

      context = [
        {
          role: 'user',
          content: `Here is a summary of our conversation so far: ${summary}`
        },
        {
          role: 'assistant',
          content: 'I understand, I will remember that.'
        }
      ];
    }

    this.context = context;

    // Update context file
    const file = join(homedir(), '.cli-chan', 'context.json');
    await writeFile(file, JSON.stringify(this.context), {
      encoding: 'utf-8',
      mode: 0o600
    });
  }
}
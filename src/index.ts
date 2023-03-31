#!/usr/bin/env node

// Imports
import Config from './services/config';
import { Command } from 'commander';
import OpenAI from './services/openai';
import Context from './services/context';

// Init
const program = new Command();

// Program
program
  .name('cli-chan')
  .description("A kawaii copilot for your CLI")
  .version("1.0.1")

// Commands

// -> Config
program.command('config')
  .description('Change the configuration of CLI Chan')
  .option('-k, --key <key>', 'Set the OpenAI API key')
  .action(async (options) => {
    await Config.loadConfig();

    // -> Set OpenAI API key
    if (options.key) {
      await Config.setConfig('openaiSecretKey', options.key);
      console.log('OpenAI API key set!');
    }
  });

// -> Forget
program.command('forget')
  .description('Forget everything CLI Chan has learned so far')
  .aliases(['reset', 'clear'])
  .action(async () => {
    await Context.loadContext();

    await Context.setContext([]);

    console.log('I\'ve cleared my memory. I\'m ready to learn again!');
  });

// -> Ask
program.command('ask <question...>')
  .description('Chat with CLI Chan')
  .allowUnknownOption()
  .action(async (question) => {
    await Config.loadConfig();

    if (!Config.config?.openaiSecretKey)
      return console.log('Error: OpenAI API key not set\nPlease run `cc config -k <key>` to set the OpenAI API key');

    await Context.loadContext();

    await OpenAI.init(Config.config.openaiSecretKey);

    const answer = await OpenAI.chat(question.join(' '), Context.context);

    console.log(answer);
  });

// -> Command
program.command('command <question...>')
  .aliases(['cmd'])
  .description('Ask CLI Chan to generate a command')
  .allowUnknownOption()
  .action(async (question) => {
    await Config.loadConfig();

    if (!Config.config?.openaiSecretKey)
      return console.log('Error: OpenAI API key not set\nPlease run `cc config -k <key>` to set the OpenAI API key');

    await Context.loadContext();

    await OpenAI.init(Config.config.openaiSecretKey);

    const answer = await OpenAI.chat(question.join(' '), Context.context, true);

    console.log(answer);
  });

program.parse();

import { Command } from 'commander';
import Config from '../services/config';
import Context from '../services/context';
import OpenAI from '../services/openai';
import { describe, expect, test } from '@jest/globals';
import { exec } from 'child_process';
import path from 'path';

interface CLIResult {
  code: number;
  error: Error | null;
  stdout: string;
  stderr: string;
}

describe('cli-chan', () => {
  test('Set OpenAI API key', async () => {
    const result = await cli(['config', '-k', 'test'], path.resolve('./src')) as CLIResult;

    expect(result.code).toBe(0);
  });

  test('Forget everything', async () => {
    const result = await cli(['forget'], path.resolve('./src')) as CLIResult;

    expect(result.code).toBe(0);
  });

  test('Chat with CLI Chan', async () => {
    const result = await cli(['ask', 'Hello!'], path.resolve('./src')) as CLIResult;

    expect(result.code).toBe(0);
    expect(result.stdout).not.toBe('');
  });
});

function cli(args: string[], cwd: string) {
  return new Promise(resolve => {
    exec(`ts-node ${path.resolve('./src/index.ts')} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        })
      })
  })
}
// Imports
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { homedir } from "os";
import { join } from "path";

// Conig Service
export default class Config {
  static config: {
    openaiSecretKey: string;
  } | null = null;

  static async loadConfig() {
    // Get config directory
    const dir = join(homedir(), '.cli-chan');

    // If directory doesn't exist, create it
    if (!existsSync(dir))
      await mkdir(dir);

    // Get config file
    const file = join(dir, 'config.json');

    // If file doesn't exist, create it
    if (!existsSync(file))
      await writeFile(file, JSON.stringify({ openaiSecretKey: '' }), {
        encoding: 'utf-8',
        mode: 0o600
      });

    // Read config file
    const config = await import(file);

    // Set config
    this.config = config.default;
  }

  static async setConfig(key: 'openaiSecretKey', value: string) {
    if (!this.config)
      await this.loadConfig();

    this.config![key] = value;

    // Update config file
    const file = join(homedir(), '.cli-chan', 'config.json');

    await writeFile(file, JSON.stringify(this.config), {
      encoding: 'utf-8',
      mode: 0o600
    });
  }
}
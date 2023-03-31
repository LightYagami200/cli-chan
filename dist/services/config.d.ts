export default class Config {
    static config: {
        openaiSecretKey: string;
    } | null;
    static loadConfig(): Promise<void>;
    static setConfig(key: 'openaiSecretKey', value: string): Promise<void>;
}

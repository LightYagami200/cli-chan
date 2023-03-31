#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const config_1 = __importDefault(require("./services/config"));
const commander_1 = require("commander");
const openai_1 = __importDefault(require("./services/openai"));
const context_1 = __importDefault(require("./services/context"));
// Init
const program = new commander_1.Command();
// Program
program
    .name('cli-chan')
    .description("A kawaii copilot for your CLI")
    .version("1.0.0");
// Commands
// -> Config
program.command('config')
    .description('Change the configuration of CLI Chan')
    .option('-k, --key <key>', 'Set the OpenAI API key')
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.default.loadConfig();
    // -> Set OpenAI API key
    if (options.key) {
        yield config_1.default.setConfig('openaiSecretKey', options.key);
        console.log('OpenAI API key set!');
    }
}));
// -> Forget
program.command('forget')
    .description('Forget everything CLI Chan has learned so far')
    .aliases(['reset', 'clear'])
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    yield context_1.default.loadContext();
    yield context_1.default.setContext([]);
    console.log('I\'ve cleared my memory. I\'m ready to learn again!');
}));
// -> Ask
program.command('ask <question...>')
    .description('Chat with CLI Chan')
    .allowUnknownOption()
    .action((question) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield config_1.default.loadConfig();
    if (!((_a = config_1.default.config) === null || _a === void 0 ? void 0 : _a.openaiSecretKey))
        return console.log('Error: OpenAI API key not set\nPlease run `cc config -k <key>` to set the OpenAI API key');
    yield context_1.default.loadContext();
    yield openai_1.default.init(config_1.default.config.openaiSecretKey);
    const answer = yield openai_1.default.chat(question.join(' '), context_1.default.context);
    console.log(answer);
}));
program.parse();
//# sourceMappingURL=index.js.map
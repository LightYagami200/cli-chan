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
const globals_1 = require("@jest/globals");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
(0, globals_1.describe)('cli-chan', () => {
    (0, globals_1.test)('Set OpenAI API key', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield cli(['config', '-k', 'test'], path_1.default.resolve('./src'));
        (0, globals_1.expect)(result.code).toBe(0);
    }));
    (0, globals_1.test)('Forget everything', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield cli(['forget'], path_1.default.resolve('./src'));
        (0, globals_1.expect)(result.code).toBe(0);
    }));
    (0, globals_1.test)('Chat with CLI Chan', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield cli(['ask', 'Hello!'], path_1.default.resolve('./src'));
        (0, globals_1.expect)(result.code).toBe(0);
        (0, globals_1.expect)(result.stdout).not.toBe('');
    }));
});
function cli(args, cwd) {
    return new Promise(resolve => {
        (0, child_process_1.exec)(`ts-node ${path_1.default.resolve('./src/index.ts')} ${args.join(' ')}`, { cwd }, (error, stdout, stderr) => {
            resolve({
                code: error && error.code ? error.code : 0,
                error,
                stdout,
                stderr
            });
        });
    });
}
//# sourceMappingURL=cliChan.test.js.map
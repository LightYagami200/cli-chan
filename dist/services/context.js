"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const os_1 = require("os");
const path_1 = require("path");
const openai_1 = __importDefault(require("./openai"));
// Context Service
class Context {
    static loadContext() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get config directory
            const dir = (0, path_1.join)((0, os_1.homedir)(), '.cli-chan');
            // Get context file
            const file = (0, path_1.join)(dir, 'context.json');
            // If file doesn't exist, create it
            if (!(0, fs_1.existsSync)(file))
                yield (0, promises_1.writeFile)(file, JSON.stringify(this.context), {
                    encoding: 'utf-8',
                    mode: 0o600
                });
            // Read context file
            const context = (yield Promise.resolve(`${file}`).then(s => __importStar(require(s)))).default;
            // Set context
            this.context = context;
        });
    }
    static setContext(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.context)
                yield this.loadContext();
            // If context is larger than 8000 characters, summarize it
            if (JSON.stringify(context).length > 8000) {
                const summary = yield openai_1.default.summarize(context);
                console.info({
                    summary
                });
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
            const file = (0, path_1.join)((0, os_1.homedir)(), '.cli-chan', 'context.json');
            yield (0, promises_1.writeFile)(file, JSON.stringify(this.context), {
                encoding: 'utf-8',
                mode: 0o600
            });
        });
    }
}
Context.context = [];
exports.default = Context;
//# sourceMappingURL=context.js.map
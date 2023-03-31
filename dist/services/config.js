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
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const os_1 = require("os");
const path_1 = require("path");
// Conig Service
class Config {
    static loadConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get config directory
            const dir = (0, path_1.join)((0, os_1.homedir)(), '.cli-chan');
            // If directory doesn't exist, create it
            if (!(0, fs_1.existsSync)(dir))
                yield (0, promises_1.mkdir)(dir);
            // Get config file
            const file = (0, path_1.join)(dir, 'config.json');
            // If file doesn't exist, create it
            if (!(0, fs_1.existsSync)(file))
                yield (0, promises_1.writeFile)(file, JSON.stringify({ openaiSecretKey: '' }), {
                    encoding: 'utf-8',
                    mode: 0o600
                });
            // Read config file
            const config = yield Promise.resolve(`${file}`).then(s => __importStar(require(s)));
            // Set config
            this.config = config.default;
        });
    }
    static setConfig(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config)
                yield this.loadConfig();
            this.config[key] = value;
            // Update config file
            const file = (0, path_1.join)((0, os_1.homedir)(), '.cli-chan', 'config.json');
            yield (0, promises_1.writeFile)(file, JSON.stringify(this.config), {
                encoding: 'utf-8',
                mode: 0o600
            });
        });
    }
}
Config.config = null;
exports.default = Config;
//# sourceMappingURL=config.js.map
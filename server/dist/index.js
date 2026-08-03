"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const envResult = dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 8080;
console.log('----------------------------------------------------');
console.log(`🚀 [DEV CANVAS BACKEND STARTUP]`);
console.log(`📌 [.env Loaded]:`, envResult.error ? 'FAILED' : 'SUCCESS');
console.log(`📌 [DATABASE_URL]:`, process.env.DATABASE_URL);
console.log(`📌 [CLIENT_URL]:`, process.env.CLIENT_URL);
console.log(`📌 [PORT]:`, PORT);
console.log('----------------------------------------------------');
app_1.default.listen(PORT, () => {
    console.log(`🚀 DevCanvas Server listening on http://localhost:${PORT}`);
});

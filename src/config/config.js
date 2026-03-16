import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "config.json");
const raw = fs.readFileSync(configPath, "utf-8");
const config = JSON.parse(raw);

export default config;
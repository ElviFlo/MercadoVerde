import { execSync } from "node:child_process";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const base = join(root, "Services");

for (const name of readdirSync(base)) {
  const dir = join(base, name);
  if (statSync(dir).isDirectory() && existsSync(join(dir, "package.json"))) {
    console.log(`\n📦 Instalando en ${dir}`);
    execSync(`npm i`, { cwd: dir, stdio: "inherit" });
  }
}
console.log("\n✅ Listo.");

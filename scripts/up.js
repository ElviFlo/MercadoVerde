// scripts/up.js
const { spawn } = require("node:child_process");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

// name, dir, candidatos de script (orden)
const MATRIX = [
  ["auth",       "Services/auth",       ["start:dev", "dev"]],
  ["products",   "Services/products",   ["dev"]],
  ["orders",     "Services/orders",     ["dev", "start:dev"]],
  ["categories", "Services/categories", ["dev", "start:dev"]],
  ["cart",       "Services/cart",       ["start:dev", "dev"]],
  ["voice",      "Services/voice",      ["dev", "start:dev"]],
];

const COLORS = ["\x1b[36m", "\x1b[32m", "\x1b[35m", "\x1b[33m", "\x1b[34m", "\x1b[31m"];
const RESET = "\x1b[0m";

// Patrones de ruido a ocultar
const NOISE = [
  /Starting compilation in watch mode/i,
  /Found 0 errors\. Watching/i,
  /\[dotenv.*\]/i,
];

// Nest “ruidoso” (conservar solo hitos útiles)
function isNoisyNestLine(line) {
  if (!/\[Nest\]/.test(line)) return false;
  const keep =
    /(running on port|listening|Swagger|docs?)/i.test(line);
  return !keep;
}

function readPkg(dir) {
  try {
    return JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  } catch {
    return null;
  }
}

function pickScript(dir, candidates) {
  const pkg = readPkg(dir);
  if (!pkg?.scripts) return null;
  for (const s of candidates) if (pkg.scripts[s]) return ["npm", ["run", s]];
  return null;
}

// Fallbacks cuando no hay script declarado
function fallbackCommand(dir) {
  // 1) Si hay tsx en devDeps, probamos tsx watch src/main.ts
  try {
    const pkg = readPkg(dir);
    const hasTsx =
      pkg?.devDependencies?.tsx || pkg?.dependencies?.tsx;
    if (hasTsx) return ["npx", ["tsx", "watch", "src/main.ts"]];
  } catch {}
  // 2) Si existe dist/main.js, arrancamos node dist/main.js
  if (existsSync(join(dir, "dist", "main.js"))) {
    return ["node", ["dist/main.js"]];
  }
  // sin fallback
  return null;
}

function filterWrite(tag, chunk) {
  const text = chunk.toString();
  const lines = text.split(/\r?\n/);
  for (const ln of lines) {
    if (!ln) continue;
    if (NOISE.some((rx) => rx.test(ln))) continue;
    if (isNoisyNestLine(ln)) continue;
    process.stdout.write(`${tag} ${ln}\n`);
  }
}

function upOne(idx, name, dir, candidates) {
  if (!existsSync(dir)) {
    console.log(`${name}: carpeta no existe (${dir}), omito`);
    return null;
  }

  let cmdArgs = pickScript(dir, candidates);
  let origin = "script";

  if (!cmdArgs) {
    const fb = fallbackCommand(dir);
    if (fb) {
      cmdArgs = fb;
      origin = "fallback";
    } else {
      console.log(`${name}: no encontré scripts [${candidates.join(", ")}] ni fallback (tsx/node), omito`);
      return null;
    }
  }

  const [cmd, args] = cmdArgs;
  const color = COLORS[idx % COLORS.length];
  const tag = `${color}[${name}]${RESET}`;

  console.log(`${tag} iniciando (${origin}): ${cmd} ${args.join(" ")}`);

  const child = spawn(cmd, args, { cwd: dir, shell: true, env: process.env });

  child.stdout.on("data", (d) => filterWrite(tag, d));
  child.stderr.on("data", (d) => filterWrite(tag, d));
  child.on("close", (code) => console.log(`${tag} proceso terminó con código ${code}`));

  return child;
}

(function main() {
  console.log("⚙️  levantando microservicios...\n");
  const procs = MATRIX.map((row, i) => upOne(i, row[0], row[1], row[2])).filter(Boolean);
  if (procs.length === 0) {
    console.log("Nada para levantar. Revisa rutas y scripts en package.json de cada servicio.");
  } else {
    console.log("\n🟢 up: corriendo. Ctrl+C para detener todos.");
  }
})();

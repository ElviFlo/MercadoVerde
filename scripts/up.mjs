import { execSync, spawn } from "node:child_process";
import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";

const base = join(process.cwd(), "Services");

// Descubre servicios con package.json
const services = readdirSync(base)
  .map((name) => join(base, name))
  .filter(
    (dir) =>
      statSync(dir).isDirectory() && existsSync(join(dir, "package.json")),
  );

if (services.length === 0) {
  console.log("No se encontraron servicios en Services/* con package.json");
  process.exit(1);
}

// 1) Instalar dependencias (secuencial para evitar ruido excesivo)
for (const dir of services) {
  console.log(`\n📦 Instalando en ${dir}`);
  execSync("npm i", { cwd: dir, stdio: "inherit" });
}

// 2) Elegir script de arranque por servicio: dev > start:dev > start
function pickScript(dir) {
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const s = pkg.scripts || {};
  return s.dev
    ? "dev"
    : s["start:dev"]
      ? "start:dev"
      : s.start
        ? "start"
        : null;
}

// 3) Lanzar todos en paralelo y prefijar logs
const children = [];
for (const dir of services) {
  const name = basename(dir);
  const script = pickScript(dir);
  if (!script) {
    console.warn(
      `⚠️  ${name}: no tiene scripts dev/start:dev/start — se omite`,
    );
    continue;
  }
  console.log(`🚀 ${name}: npm run ${script}`);
  const child = spawn("npm", ["run", script], {
    cwd: dir,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const prefix = (line, stream) => process[stream].write(`[${name}] ${line}`);

  child.stdout.on("data", (buf) =>
    buf
      .toString()
      .split(/\r?\n/)
      .forEach((l) => l && prefix(l + "\n", "stdout")),
  );
  child.stderr.on("data", (buf) =>
    buf
      .toString()
      .split(/\r?\n/)
      .forEach((l) => l && prefix(l + "\n", "stderr")),
  );

  child.on("exit", (code) => {
    console.log(`[${name}] proceso finalizó con código ${code}`);
  });

  children.push(child);
}

// 4) Manejo de Ctrl+C
const shutdown = () => {
  console.log("\n🛑 Deteniendo servicios...");
  for (const c of children) {
    try {
      c.kill("SIGINT");
    } catch {}
  }
  setTimeout(() => process.exit(0), 500).unref();
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

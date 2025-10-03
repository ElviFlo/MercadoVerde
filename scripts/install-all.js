// scripts/install-all.js
const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

const services = [
  { name: "auth",       dir: "Services/auth" },
  { name: "products",   dir: "Services/products" },
  { name: "orders",     dir: "Services/orders" },
  { name: "cart",       dir: "Services/cart" },
  { name: "voice",      dir: "Services/voice" },
  { name: "categories", dir: "Services/categories" },
];

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, stdio: "inherit", shell: true });
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")} -> ${code}`))
    );
  });
}

(async () => {
  for (const s of services) {
    const pkg = join(process.cwd(), s.dir, "package.json");
    if (!existsSync(s.dir)) {
      console.log(`↷ omito ${s.name}: carpeta no existe (${s.dir})`);
      continue;
    }
    if (!existsSync(pkg)) {
      console.log(`↷ omito ${s.name}: no hay package.json`);
      continue;
    }
    console.log(`\n📦 instalando ${s.name} (${s.dir}) ...`);
    await run("npm", ["i"], s.dir);
    console.log(`✅ ${s.name} listo`);
  }
  console.log("\n🎉 install-all: completado");
})().catch((err) => {
  console.error("❌ install-all: error\n", err.message);
  process.exit(1);
});

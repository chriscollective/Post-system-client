#!/usr/bin/env node

const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { pathToFileURL } = require("node:url");

process.env.VITE_CJS_IGNORE_WARNING = "1";

const isTestMode = process.env.VITE_TEST_MODE === "1";
const projectRoot = path.resolve(__dirname, "..");

async function runHeadless() {
  const port = process.env.VITE_TEST_PORT || "5173";
  const viteNodeEntry = path.join(
    projectRoot,
    "node_modules",
    "vite",
    "dist",
    "node",
    "index.js"
  );
  const { createServer } = await import(pathToFileURL(viteNodeEntry).href);
  const vitePkgPath = path.join(
    projectRoot,
    "node_modules",
    "vite",
    "package.json"
  );
  const viteVersion = JSON.parse(fs.readFileSync(vitePkgPath, "utf8")).version;
  const logPath = process.env.VITE_TEST_LOG_PATH
    ? path.resolve(projectRoot, process.env.VITE_TEST_LOG_PATH)
    : null;

  const server = await createServer({
    configFile: path.join(projectRoot, "vite.config.ts"),
    server: {
      middlewareMode: true,
    },
    logLevel: "silent",
  });

  try {
    await server.initialize?.();
    const outputLines = [
      `\n  VITE v${viteVersion}  ready in headless mode\n`,
      `  ➜  Local:   http://127.0.0.1:${port}\n`,
    ];

    for (const line of outputLines) {
      console.log(line);
    }

    if (logPath) {
      fs.mkdirSync(path.dirname(logPath), { recursive: true });
      fs.writeFileSync(logPath, outputLines.join(""), "utf8");
    }

    console.log(
      "🧪 [VITE_TEST_MODE] Headless client waiting for termination signal..."
    );
    await new Promise((resolve) => {
      const clean = () => {
        process.off("SIGINT", onSignal);
        process.off("SIGTERM", onSignal);
        resolve();
      };
      const onSignal = () => clean();
      process.on("SIGINT", onSignal);
      process.on("SIGTERM", onSignal);
    });
    console.log("✅ [VITE_TEST_MODE] Termination signal received, shutting down.");
  } finally {
    await server.close();
  }
}

async function runCli() {
  const args = process.argv.slice(2);

  // 🟢 改成直接呼叫 vite，而不是 require.resolve("vite/bin/vite.js")
  const child = spawn("npx", ["vite", ...args], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true, // 讓 npx 在 WSL/Windows 都能正常運作
    env: {
      ...process.env,
      FORCE_COLOR: "1",
    },
  });

  // 🧩 同步子程序的退出狀態（與原程式一致）
  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 0);
    }
  });
}

if (isTestMode) {
  runHeadless().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
} else {
  runCli();
}

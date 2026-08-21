import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const applications = [
  ["koa", "/benchmark/health"],
  ["koa-sources", "/sources/query?input=1%2B1"],
  ["koa2", "/evaluate?input=1%2B1"],
  ["koa-esm", "/evaluate?input=1%2B1"],
  ["nest10-express", "/api/evaluate?input=1%2B1"],
  ["nest10-fastify", "/api/evaluate?input=1%2B1"],
  ["nest-express", "/api/evaluate?input=1%2B1"],
  ["nest-fastify", "/api/evaluate?input=1%2B1"],
  ["aurelia1", "/evaluate?input=1%2B1"],
  ["aurelia2", "/evaluate?input=1%2B1"],
];

for (const [application, route] of applications) {
  const port = await availablePort();
  const child = spawn("./runBenchmark.sh", [application], {
    cwd: root,
    detached: true,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "ignore", "pipe"],
  });
  let errors = "";
  child.stderr.on("data", (chunk) => { errors += chunk; });
  try {
    await waitFor(`http://127.0.0.1:${port}${route}`, child);
    if (application === "koa-sources") await verifySourceBreadth(port);
    process.stdout.write(`smoke passed: ${application}\n`);
  } catch (error) {
    throw new Error(`${application}: ${error.message}\n${errors}`);
  } finally {
    await terminate(child);
  }
}

async function availablePort() {
  const server = createServer();
  server.unref();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    server.close();
    throw new Error("operating system did not allocate a TCP port");
  }
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
  return address.port;
}

async function terminate(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  try { process.kill(-child.pid, "SIGTERM"); } catch {}
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ]);
  if (child.exitCode !== null || child.signalCode !== null) return;
  try { process.kill(-child.pid, "SIGKILL"); } catch {}
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ]);
}

async function verifySourceBreadth(port) {
  const origin = `http://127.0.0.1:${port}`;
  const requests = [
    ["/sources/query?input=1%2B1", {}],
    ["/sources/path/1%2B1", {}],
    ["/sources/header", { headers: { "x-benchmark-input": "1+1" } }],
    ["/sources/cookie", { headers: { cookie: "benchmark_input=1%2B1" } }],
    ["/sources/middleware", { headers: { "x-middleware-input": "1+1" } }],
    ["/sources/principal", { headers: { authorization: "Bearer 1+1" } }],
    ["/sources/json", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ input: "1+1" }) }],
    ["/sources/form", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "input=1%2B1" }],
    ["/sources/multipart", { method: "POST", headers: { "content-type": "multipart/form-data; boundary=benchmark" }, body: "--benchmark\r\n\r\n1+1\r\n--benchmark--" }],
    ["/sources/stream", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: "1+1" }],
  ];
  for (const [route, options] of requests) {
    const response = await fetch(`${origin}${route}`, options);
    if (response.status >= 500) throw new Error(`source breadth route ${route} returned ${response.status}`);
    await response.arrayBuffer();
  }
}

async function waitFor(url, child) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`process exited with ${child.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("application did not become ready within 10 seconds");
}

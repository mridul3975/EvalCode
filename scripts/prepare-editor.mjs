import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const source = resolve("node_modules/monaco-editor");
const target = resolve("public/vendor/monaco");
const { version } = JSON.parse(await readFile(resolve(source, "package.json"), "utf8"));
let installed;
try { installed = await readFile(resolve(target, ".version"), "utf8"); } catch {}
if (installed !== version) {
  await mkdir(target, { recursive: true });
  await cp(resolve(source, "min/vs"), resolve(target, "vs"), { recursive: true });
  await cp(resolve(source, "LICENSE"), resolve(target, "LICENSE"));
  await writeFile(resolve(target, ".version"), version);
}

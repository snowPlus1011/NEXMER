import { watch } from "node:fs";
import { syncContent } from "./sync-content.mjs";
await syncContent();
let timeout;
let chain = Promise.resolve();
watch("resources", { recursive: true }, () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => { chain = chain.then(() => syncContent()).catch(error => console.error(error.message)); }, 350);
});
console.log("正在监听 resources 文件夹；按 Ctrl+C 结束。");

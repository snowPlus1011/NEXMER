import path from "node:path";
import { syncContent } from "./sync-content.mjs";
export function contentResources() {
  return {
    name: "resource-folder-content",
    configureServer(server) {
      const resourcePath = path.join(server.config.root, "resources");
      server.watcher.add(resourcePath);
      let timeout;
      let chain = Promise.resolve();
      const changed = (_event, file) => {
        if (!file.startsWith(resourcePath + path.sep)) return;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          chain = chain.then(async () => {
            await syncContent(server.config.root);
            server.ws.send({ type: "full-reload" });
          }).catch(error => server.config.logger.error(`[资源配置] ${error.message}`));
        }, 350);
      };
      server.watcher.on("all", changed);
      server.httpServer?.once("close", () => { clearTimeout(timeout); server.watcher.off("all", changed); });
    }
  };
}

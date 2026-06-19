// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var { docs: docDocs, meta: docMeta } = defineDocs({
  dir: "content/docs/documentation"
});
var { docs: userDocs, meta: userMeta } = defineDocs({
  dir: "content/docs/user-guide"
});
var { docs: devDocs, meta: devMeta } = defineDocs({
  dir: "content/docs/developer-guide"
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  devDocs,
  devMeta,
  docDocs,
  docMeta,
  userDocs,
  userMeta
};

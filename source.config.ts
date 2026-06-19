import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const { docs: docDocs, meta: docMeta } = defineDocs({
  dir: 'content/docs/documentation',
});

export const { docs: userDocs, meta: userMeta } = defineDocs({
  dir: 'content/docs/user-guide',
});

export const { docs: devDocs, meta: devMeta } = defineDocs({
  dir: 'content/docs/developer-guide',
});

export default defineConfig();

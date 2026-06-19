import { docDocs, docMeta, userDocs, userMeta, devDocs, devMeta } from '@/.source';
import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';

export const docSource = loader({
  baseUrl: '/docs/documentation',
  source: createMDXSource(docDocs, docMeta),
});

export const userSource = loader({
  baseUrl: '/docs/user-guide',
  source: createMDXSource(userDocs, userMeta),
});

export const devSource = loader({
  baseUrl: '/docs/developer-guide',
  source: createMDXSource(devDocs, devMeta),
});

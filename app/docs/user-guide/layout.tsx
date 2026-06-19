import { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { userSource } from '@/app/source';
import { DocSwitcher } from '@/components/DocSwitcher';
import '../docs.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <DocsLayout tree={userSource.pageTree} sidebar={{ banner: <DocSwitcher /> }}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}

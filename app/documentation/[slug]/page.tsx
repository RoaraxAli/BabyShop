import { notFound } from "next/navigation";
import { DocsShell } from "@/components/DocsShell";
import { docs, type DocSlug } from "@/lib/docs";

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = docs[params.slug as DocSlug];
  if (!doc) return {};

  return {
    title: `${doc.title} | BabyShopHub Docs`,
    description: doc.description,
  };
}

export default function DocumentationPage({ params }: { params: { slug: string } }) {
  const slug = params.slug as DocSlug;

  if (!docs[slug]) {
    notFound();
  }

  return (
    <DocsShell slug={slug} />
  );
}

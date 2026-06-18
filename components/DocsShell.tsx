import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { docGroups, docs, type DocSlug } from "@/lib/docs";

export function DocsShell({ slug }: { slug: DocSlug }) {
  const doc = docs[slug];

  return (
    <main className="docs-shell">
      <section className="docs-landing-hero">
        <div>
          <span className="section-kicker">Documentation</span>
          <h1>{doc.title}</h1>
          <p>{doc.description}</p>
        </div>
        <div className="docs-search">
          <Search size={18} />
          Search docs, guides, deployment, APIs
        </div>
      </section>

      <section className="docs-frame">
        <aside className="docs-sidebar">
          <Link className="docs-home-link" href="/documentation">
            <BookOpen size={18} />
            Docs Home
          </Link>
          {docGroups.map((group) => (
            <div key={group.title}>
              <strong>{group.title}</strong>
              {group.pages.map((page) => (
                <Link
                  className={page.href.endsWith(`/${slug}`) ? "active" : ""}
                  href={page.href}
                  key={page.href}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          ))}
        </aside>

        <article className="docs-article">
          {doc.sections.map(([title, body]) => (
            <section id={title.toLowerCase().replaceAll(" ", "-")} key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
        </article>

        <aside className="docs-toc">
          <strong>On this page</strong>
          {doc.sections.map(([title]) => (
            <a href={`#${title.toLowerCase().replaceAll(" ", "-")}`} key={title}>
              {title}
            </a>
          ))}
        </aside>
      </section>
    </main>
  );
}

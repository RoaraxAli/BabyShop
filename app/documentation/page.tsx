import { ArrowRight, BookOpen, Boxes, Code2, Compass, Rocket, ShieldCheck } from "lucide-react";
import { docGroups } from "@/lib/docs";

const highlights = [
  { title: "Product Overview", body: "Understand public website, web app, Flutter app, docs, and admin responsibilities.", icon: Compass },
  { title: "User Workflows", body: "Accounts, shopping, checkout, assistant, orders, returns, and profile behavior.", icon: Boxes },
  { title: "Developer Guide", body: "Architecture, frontend, backend, data model, testing, deployment, and security.", icon: Code2 },
  { title: "Launch Ready", body: "Domain strategy for web.yourdomain.com and docs.yourdomain.com.", icon: Rocket },
];

export default function DocumentationHome() {
  return (
    <main className="docs-shell docs-standalone">
        <section className="docs-home-hero">
          <div>
            <span className="section-kicker">Documentation</span>
            <h1>BabyShopHub Docs</h1>
            <p>
              Product-grade documentation for users, developers, deployment, security, downloads,
              operations, and the full website/app ecosystem.
            </p>
            <a className="button dark" href="/documentation/overview">
              Start reading
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="docs-hero-panel">
            <ShieldCheck size={30} />
            <strong>Recommended production domains</strong>
            <span>web.yourdomain.com for the website and app entry. docs.yourdomain.com for documentation.</span>
          </div>
        </section>

        <section className="docs-highlight-grid">
          {highlights.map(({ title, body, icon: Icon }) => (
            <article key={title}>
              <Icon size={24} />
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </section>

        <section className="docs-index">
          {docGroups.map((group) => (
            <article key={group.title}>
              <h2>{group.title}</h2>
              {group.pages.map((page) => (
                <a href={page.href} key={page.href}>
                  <BookOpen size={17} />
                  {page.title}
                  <ArrowRight size={16} />
                </a>
              ))}
            </article>
          ))}
        </section>
    </main>
  );
}

import { Apple, Globe2, Monitor, Smartphone, Download } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

const downloadTargets = [
  {
    title: "Android Application",
    body: "Install the BabyShopHub APK directly on your Android phone for on-the-go nursery shopping.",
    actionText: "Download APK File",
    href: "/downloads/babyshophub.apk",
    icon: Smartphone,
    color: "mint-bg",
    badge: "v1.0.0-Stable"
  },
  {
    title: "iOS App Store",
    body: "Get the secure iOS build for your iPhone. Supports Apple Sign-In and secure checkout.",
    actionText: "Open App Store",
    href: "https://apps.apple.com",
    icon: Apple,
    color: "sky-bg",
    badge: "iOS 15+"
  },
  {
    title: "Windows Desktop",
    body: "Desktop application targeting Windows 10/11. Includes local system support and tracking offline.",
    actionText: "Download Windows App",
    href: "/downloads/babyshophub-windows.zip",
    icon: Monitor,
    color: "lavender-bg",
    badge: "Win 10/11"
  },
  {
    title: "Web Storefront",
    body: "Access the full online catalog instantly from any web browser without installation.",
    actionText: "Launch Web App",
    href: "/shop",
    icon: Globe2,
    color: "peach-bg",
    badge: "No Install"
  },
];

export default function DownloadsPage() {
  return (
    <>
      <Nav />
      <main className="simple-page">
        <section className="page-hero downloads-hero">
          <span className="section-kicker">Multi-Platform Access</span>
          <h1>Get BabyShopHub on all your devices.</h1>
          <p>
            Experience premium infant care shopping. Keep your account synchronized across our mobile applications, desktop package, and online web client.
          </p>
        </section>
        
        <section className="download-grid-premium">
          {downloadTargets.map((target) => {
            const Icon = target.icon;
            return (
              <article key={target.title} className={`download-card ${target.color}`}>
                <div className="card-header-badge">
                  <Icon size={24} />
                  <span className="badge-text">{target.badge}</span>
                </div>
                <h2>{target.title}</h2>
                <p>{target.body}</p>
                <a className="button dark-rounded-btn" href={target.href} download={target.href.includes(".apk") || target.href.includes(".zip")}>
                  <Download size={16} />
                  {target.actionText}
                </a>
              </article>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}


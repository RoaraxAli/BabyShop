import { ShieldCheck, Leaf, BadgeCheck, RotateCcw } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="simple-page">
        <section className="about-flutter-page">
          <div className="about-hero">
            <ShieldCheck size={72} className="about-shield" />
            <h1>About BabyShopHub</h1>
            <h2>Premium Standards in Infant Care</h2>
            <p>
              BabyShopHub is dedicated to offering only clinically certified, pediatric-tested baby
              essentials. We understand the paramount importance of clinical safety, non-toxic
              products, and comfort during your child&apos;s critical developmental milestones.
            </p>
          </div>
          
          <div className="about-list">
            <article>
              <Leaf size={32} />
              <div>
                <h2>100% Organic Products</h2>
                <p>We prioritize sustainably farmed fabrics and completely organic baby formulas containing zero synthetic fillers.</p>
              </div>
            </article>
            <article>
              <BadgeCheck size={32} />
              <div>
                <h2>Clinical Certifications</h2>
                <p>Every product batch undergoes strict dermatological screening to avoid infant skin irritation and allergies.</p>
              </div>
            </article>
            <article>
              <RotateCcw size={32} />
              <div>
                <h2>30-Day Hassle-Free Returns</h2>
                <p>Our customer care handles swift exchanges on unopened shipments, ensuring absolute satisfaction.</p>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


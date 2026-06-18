import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>BabyShop</strong>
        <p>Modern baby shopping for essentials, support, and calmer parent decisions.</p>
      </div>
      <div className="footer-links">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/downloads">Downloads</Link>
        <Link href="/documentation">Documentation</Link>
        <Link href="/login">Login</Link>
      </div>
    </footer>
  );
}

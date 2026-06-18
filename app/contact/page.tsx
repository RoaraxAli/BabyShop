"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Mail, MessageSquare, UserRound } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { useAuth } from "@/components/AuthProvider";
import { auth, db } from "@/lib/firebase";

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitFeedback(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const currentUser = auth.currentUser;
      await addDoc(collection(db, "support_tickets"), {
        userId: currentUser?.uid ?? user?.uid ?? "",
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: "Open",
        replies: [],
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, "mail_triggers"), {
        to: "hello@theali.tech",
        type: "SUPPORT_CONTACT",
        data: { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() },
        createdAt: serverTimestamp(),
      });
      setSubject("");
      setMessage("");
      setStatus("Support request sent successfully. It is now visible in the admin Support panel.");
    } catch {
      setStatus("Could not send support request. Please check Firebase permissions and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="simple-page">
        <section className="page-hero contact">
          <span className="section-kicker">Contact Customer Support</span>
          <h1>Send feedback directly to BabyShopHub support.</h1>
          <p>Your message is saved to Firebase support tickets for the admin panel, just like the Flutter app.</p>
        </section>
        <form className="feedback-form" onSubmit={submitFeedback}>
          <label><span>Name</span><div><UserRound size={18} /><input required value={name} onChange={(e) => setName(e.target.value)} /></div></label>
          <label><span>Email Address</span><div><Mail size={18} /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div></label>
          <label><span>Inquiry Subject</span><div><MessageSquare size={18} /><input required value={subject} onChange={(e) => setSubject(e.target.value)} /></div></label>
          <label><span>Support Message Details</span><textarea required minLength={10} rows={6} value={message} onChange={(e) => setMessage(e.target.value)} /></label>
          {status && <strong className="form-status">{status}</strong>}
          <button disabled={loading}>{loading ? "Sending..." : "Send Support Request"}</button>
        </form>
      </main>
      <Footer />
    </>
  );
}

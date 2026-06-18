import { redirect } from "next/navigation";

export default function LegacyDeveloperDocsPage() {
  redirect("/documentation/architecture");
}

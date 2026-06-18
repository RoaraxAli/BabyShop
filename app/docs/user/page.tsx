import { redirect } from "next/navigation";

export default function LegacyUserDocsPage() {
  redirect("/documentation/accounts");
}

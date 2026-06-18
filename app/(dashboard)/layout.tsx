import { Navbar } from "@/components/site/navbar";
import { requirePageSession } from "@/lib/auth/page-guards";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Coarse server-side gate; each page additionally enforces its own role.
  await requirePageSession();

  return (
    <>
      <Navbar />
      <main className="bg-muted/30 flex-1">{children}</main>
    </>
  );
}

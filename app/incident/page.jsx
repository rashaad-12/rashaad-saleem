import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Story } from "@/components/incident/Story";
import { incident } from "@/content/incident";

export const dynamic = "force-static";

export const metadata = {
  title: incident.title,
  description: incident.standfirst,
  alternates: { canonical: "/incident" },
  openGraph: {
    type: "article",
    url: "/incident",
    title: incident.title,
    description: incident.standfirst,
  },
};

export default function IncidentPage() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-240 px-6 sm:px-8">
        <Story />
      </main>

      <Footer />
    </>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Thread } from "@/components/layout/Thread";
import { Hero } from "@/components/sections/Hero";
import { Craft } from "@/components/sections/Craft";
import { Experience } from "@/components/sections/Experience";
import { IncidentCallout } from "@/components/sections/IncidentCallout";
import { Approach } from "@/components/sections/Approach";
import { Recommendations } from "@/components/sections/Recommendations";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <>
      <Header />
      <Thread />

      <main className="mx-auto max-w-240 px-6 sm:px-8">
        <Hero />
        <Craft />
        <Experience />
        <IncidentCallout />
        <Approach />
        <Recommendations />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

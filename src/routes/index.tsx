import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StarField } from "@/components/StarField";
import { MotivationCards } from "@/components/MotivationCards";
import { ProgressRing } from "@/components/ProgressRing";
import { FocusTimer } from "@/components/FocusTimer";
import { MusicPanel } from "@/components/MusicPanel";
import { BoostMotivation } from "@/components/BoostMotivation";
import { DailyGoals } from "@/components/DailyGoals";
import { Achievements } from "@/components/Achievements";
import { PhotoAnimation } from "@/components/PhotoAnimation";
import { FooterCTA } from "@/components/FooterCTA";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "StudyBuddy — Your Success, Our Mission" },
      { name: "description", content: "Futuristic motivational study dashboard to help students stay focused, calm, and productive during exam prep." },
      { property: "og:title", content: "StudyBuddy — Your Success, Our Mission" },
      { property: "og:description", content: "A cinematic, emotional study companion with focus timer, motivation, AI buddy and more." },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen">
      <StarField />
      <div className="relative z-10">
        <Navbar />
        <Hero />

        <main className="px-4 lg:px-12 py-10 space-y-8">
          <section id="motivation" className="grid lg:grid-cols-3 gap-6">
            <div id="progress" className="lg:col-span-2">
              <MotivationCards />
            </div>
            <ProgressRing />
          </section>

          <section id="focus" className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <FocusTimer />
            </div>
            <div className="lg:col-span-3">
              <MusicPanel />
            </div>
            <div className="lg:col-span-4">
              <BoostMotivation />
            </div>
          </section>

          <section id="goals" className="grid lg:grid-cols-3 gap-6">
            <DailyGoals />
            <Achievements />
            <div id="photo-animation">
              <PhotoAnimation />
            </div>
          </section>
        </main>

        <FooterCTA />
        <div className="h-8" />
      </div>
    </div>
  );
}

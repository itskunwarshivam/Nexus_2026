import SmoothScroll from "@/components/SmoothScroll";
import CinematicLoading from "@/components/CinematicLoading";
import Navbar from "@/components/Navbar";
import HomepageHero from "@/components/HomepageHero";
import ClubShowcase from "@/components/ClubShowcase";
import FeaturedActivities from "@/components/FeaturedActivities";
import ScheduleSection from "@/components/ScheduleSection";
import SpeakersSection from "@/components/SpeakersSection";
import FAQSection from "@/components/FAQSection";
import HomepageCTA from "@/components/HomepageCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <CinematicLoading />
      <Navbar />
      <main>
        <HomepageHero />
        <ClubShowcase />
        <FeaturedActivities />
        <ScheduleSection />
        <SpeakersSection />
        <FAQSection />
        <HomepageCTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}

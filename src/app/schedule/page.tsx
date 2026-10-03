import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScheduleSection from "@/components/ScheduleSection";

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-[#030508] pt-20">
      <Navbar />
      <ScheduleSection />
      <Footer />
    </main>
  );
}

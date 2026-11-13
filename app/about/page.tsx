import Navbar from "@/components/Navbar";
import AboutView from "@/components/AboutView";

export const metadata = {
  title: "À Propos & Mission | ApoDocs Nador",
  description:
    "Découvrez ApoDocs, la plateforme collaborative ouverte dédiée aux étudiants des facultés de Nador (Université Mohammed Premier).",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <AboutView />
    </div>
  );
}

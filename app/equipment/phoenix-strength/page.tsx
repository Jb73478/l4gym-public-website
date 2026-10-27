import type { Metadata } from "next";
import { PhoenixLanding } from "@/components/PhoenixCatalogue";
export const metadata: Metadata = { title: "Phoenix Strength Commercial Rigs & Gym Equipment", description: "Explore Phoenix Strength commercial rigs, cages, selected strength equipment and complete gym fit-out enquiries through L4Gym.", alternates: { canonical: "/equipment/phoenix-strength", languages: { en: "/equipment/phoenix-strength", de: "/de/geraete/phoenix-strength" } } };
export default function Page() { return <PhoenixLanding locale="en" />; }

import type { Metadata } from "next";
import { PhoenixLanding } from "@/components/PhoenixCatalogue";
export const metadata: Metadata = { title: "Phoenix Strength Rigs & Fitnessgeräte", description: "Phoenix Strength Rigs, Cages, ausgewählte Kraftgeräte und komplette Studioausstattungen über L4Gym anfragen.", alternates: { canonical: "/de/geraete/phoenix-strength", languages: { en: "/equipment/phoenix-strength", de: "/de/geraete/phoenix-strength" } } };
export default function Page() { return <PhoenixLanding locale="de" />; }

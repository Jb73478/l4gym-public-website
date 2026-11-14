import routes from "@/lib/phoenix-v3/routes.json";
import { PhoenixV3Page } from "@/components/PhoenixV3Page";
import { pageMetadata } from "@/lib/phoenix-v3/pages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoenixCategoryPage } from "@/components/PhoenixCatalogue";
import { getPhoenixCategory, phoenixCategories } from "@/lib/phoenix-products";
const routesForPage = routes.filter(route => route.kind === "landing" && route.lang === "de");
function keyFor(slug: string) {
  return routesForPage.find(route => route.url.endsWith("/" + (slug === "pendulum-squat-v2" ? "pendulum-squat" : slug)))?.key;
}
export function generateStaticParams() {
  const slugs = new Set([...phoenixCategories.map(item => item.slug), ...routesForPage.map(route => route.url.split("/").pop()!)]);
  slugs.delete("pendulum-squat");
  return Array.from(slugs, slug => ({ category: slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category: slug } = await params; const key = keyFor(slug); if (key) return pageMetadata(key, "de"); const category = getPhoenixCategory(slug); if (!category) return {}; return { title: `Phoenix Strength ${category.nameDe}`, description: category.descriptionDe, alternates: { canonical: `/de/geraete/phoenix-strength/${slug}`, languages: { "x-default": `/equipment/phoenix-strength/${slug}`, en: `/equipment/phoenix-strength/${slug}`, de: `/de/geraete/phoenix-strength/${slug}` } } }; }
export default async function Page({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; const key = keyFor(category); if (key) return <PhoenixV3Page pageKey={key} locale="de" />; if (!getPhoenixCategory(category)) notFound(); return <PhoenixCategoryPage locale="de" slug={category} />; }

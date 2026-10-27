import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoenixCategoryPage } from "@/components/PhoenixCatalogue";
import { getPhoenixCategory, phoenixCategories } from "@/lib/phoenix-products";
export function generateStaticParams() { return phoenixCategories.map(({ slug }) => ({ category: slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category: slug } = await params; const category = getPhoenixCategory(slug); if (!category) return {}; return { title: `Phoenix Strength ${category.name}`, description: category.description, alternates: { canonical: `/equipment/phoenix-strength/${slug}`, languages: { en: `/equipment/phoenix-strength/${slug}`, de: `/de/geraete/phoenix-strength/${slug}` } } }; }
export default async function Page({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!getPhoenixCategory(category)) notFound(); return <PhoenixCategoryPage locale="en" slug={category} />; }

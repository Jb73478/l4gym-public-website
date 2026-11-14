import routes from "@/lib/phoenix-v3/routes.json";
import { PhoenixV3Page } from "@/components/PhoenixV3Page";
import { pageMetadata } from "@/lib/phoenix-v3/pages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoenixProductPage } from "@/components/PhoenixCatalogue";
import { getPhoenixProduct, phoenixProducts } from "@/lib/phoenix-products";
const routesForPage = routes.filter(route => route.kind === "product" && route.lang === "en");
function keyFor(slug: string) {
  return routesForPage.find(route => route.url.endsWith("/" + (slug === "pendulum-squat-v2" ? "pendulum-squat" : slug)))?.key;
}
export function generateStaticParams() {
  const slugs = new Set([...phoenixProducts.map(item => item.slug), ...routesForPage.map(route => route.url.split("/").pop()!)]);
  slugs.delete("pendulum-squat");
  return Array.from(slugs, slug => ({ slug: slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const key = keyFor(slug); if (key) return pageMetadata(key, "en"); const product = getPhoenixProduct(slug); if (!product) return {}; return { title: `${product.name} | Phoenix Strength`, description: product.summary, alternates: { canonical: `/equipment/phoenix-strength/products/${slug}`, languages: { "x-default": `/equipment/phoenix-strength/products/${slug}`, en: `/equipment/phoenix-strength/products/${slug}`, de: `/de/geraete/phoenix-strength/products/${slug}` } }, openGraph: { title: `${product.name} | Phoenix Strength`, description: product.summary, images: [{ url: product.image }] } }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const key = keyFor(slug); if (key) return <PhoenixV3Page pageKey={key} locale="en" />; const product = getPhoenixProduct(slug); if (!product) notFound(); return <PhoenixProductPage locale="en" product={product} />; }

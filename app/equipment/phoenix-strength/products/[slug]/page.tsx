import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoenixProductPage } from "@/components/PhoenixCatalogue";
import { getPhoenixProduct, phoenixProducts } from "@/lib/phoenix-products";
export function generateStaticParams() { return phoenixProducts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const product = getPhoenixProduct(slug); if (!product) return {}; return { title: `${product.name} | Phoenix Strength`, description: product.summary, alternates: { canonical: `/equipment/phoenix-strength/products/${slug}`, languages: { en: `/equipment/phoenix-strength/products/${slug}`, de: `/de/geraete/phoenix-strength/products/${slug}` } }, openGraph: { title: `${product.name} | Phoenix Strength`, description: product.summary, images: [{ url: product.image }] } }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const product = getPhoenixProduct(slug); if (!product) notFound(); return <PhoenixProductPage locale="en" product={product} />; }

import routes from "./routes.json";
import en from "./en.json";
import de from "./de.json";
import type { PhoenixLocale } from "../phoenix-products";
import catalogues from "./catalogues.json";

export type Catalogue = keyof typeof catalogues;
export type Content = {
  title: string; description: string; heading: string; eyebrow: string; lead: string;
  images: string[]; catalogue: string; sku: string; cardHeading: string;
  sections: { heading: string; intro: string; rows: string[][] }[];
  cards: { name: string; slug: string; image: string; description: string }[];
  faq: string[][]; paths: string[][];
};
const content: Record<PhoenixLocale, Record<string, Content>> = { en, de };
export function pageContent(key: string, locale: PhoenixLocale) { return content[locale][key]; }
export function routeFor(key: string, locale: PhoenixLocale) {
  const route = routes.find(r => r.key === key && r.lang === locale);
  if (!route) throw Error("Unknown Phoenix page: " + key);
  return route.url.replace(/\/pendulum-squat$/, "/pendulum-squat-v2");
}
export function pageMetadata(key: string, locale: PhoenixLocale) {
  const { title, description, images } = pageContent(key, locale);
  const canonical = routeFor(key, locale);
  const english = routeFor(key, "en");
  return { title: { absolute: title }, description,
    alternates: { canonical, languages: { en: english, de: routeFor(key, "de"), "x-default": english } },
    openGraph: { title, description, url: canonical, images: [images[0]], locale: locale === "de" ? "de_DE" : "en_GB" } };
}

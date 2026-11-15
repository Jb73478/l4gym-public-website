import { EnquirySection, ProductGrid } from "./PhoenixCatalogue";
import { PhoenixGallery } from "./PhoenixGallery";
import { phoenixProducts, type PhoenixLocale } from "@/lib/phoenix-products";
import { pageContent, routeFor, type Catalogue } from "@/lib/phoenix-v3/pages";

export function PhoenixV3Page({ pageKey, locale }: { pageKey: string; locale: PhoenixLocale }) {
  const p = pageContent(pageKey, locale);
  const de = locale === "de";
  const hub = routeFor("hub", locale);
  const path = routeFor(pageKey, locale);
  const category = path.split("/").pop();
  const listed = new Set(p.cards.map(c => c.slug));
  const remaining = phoenixProducts.filter(product => product.category === category && !listed.has(product.slug)
    && !(product.model === "PDS2" && listed.has("pendulum-squat")));
  const productUrl = (slug: string) => hub + "/products/" + (slug === "pendulum-squat" ? "pendulum-squat-v2" : slug);
  return <>
    <section className="phoenix-hero"><div className="shell phoenix-hero-grid"><div>
      {pageKey !== "hub" && <a href={hub}>Phoenix Strength</a>}
      <p className="eyebrow">{p.eyebrow}</p><h1>{p.heading}</h1>
      {p.sku && <p>{de ? "Modell" : "Model"}: {p.sku}</p>}<p className="lead">{p.lead}</p>
      <div className="button-row">
        <a className="button phoenix-red" href="#catalogue">{de ? "Katalog anfordern" : "Request catalogue"}</a>
        <a className="button phoenix-outline" href="#enquiry">{de ? "Angebot anfordern" : "Request a Quote"}</a>
        {pageKey === "hub" && <a className="button phoenix-outline" href={routeFor("fitout", locale)}>{de ? "Komplette Studioausstattung besprechen" : "Discuss a Complete Gym Fit-Out"}</a>}
      </div>
    </div><PhoenixGallery images={p.images} name={p.heading} german={de} /></div></section>
    {!!p.paths.length && <section className="section"><div className="shell phoenix-category-grid">
      {p.paths.map(([key, name, description]) => <a key={key} className="phoenix-category" href={routeFor(key, locale)}><strong>{name}</strong><p>{description}</p></a>)}
      <a className="phoenix-category" href={hub + "/benches-accessories"}>{de ? "Bänke und Zubehör" : "Benches and accessories"}</a>
    </div></section>}
    {p.sections.map(section => <section className="section" key={section.heading}><div className="shell"><h2>{section.heading}</h2>
      {section.intro && <p>{section.intro}</p>}<dl>{section.rows.map(([term, detail]) =>
        <div key={term}><dt><strong>{term}</strong></dt><dd>{detail}</dd></div>)}</dl>
    </div></section>)}
    <section className="section"><div className="shell"><h2>{p.cardHeading}</h2><div className="phoenix-products">
      {p.cards.map(card => <article className="phoenix-product-card" key={card.name}><img src={card.image} loading="lazy" alt={card.name} />
        <div><h3><a href={card.slug ? productUrl(card.slug) : "#enquiry"}>{card.name}</a></h3><p>{card.description}</p></div></article>)}
    </div>{!!remaining.length && <ProductGrid locale={locale} products={remaining} />}</div></section>
    <section className="section"><div className="shell"><h2>{de ? "Häufige Fragen" : "Frequently asked questions"}</h2>
      {p.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    <EnquirySection locale={locale} catalogue={p.catalogue as Catalogue} productInfo={p.sku ? {name:p.heading, model:p.sku} : undefined}
      defaultRequestType={p.sku ? "product_enquiry" : pageKey === "fitout" ? "complete_gym_fitout" : "quotation"} />
    {p.sku && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context":"https://schema.org","@type":"Product",name:p.heading,sku:p.sku,image:p.images,description:p.lead,brand:{"@type":"Brand",name:"Phoenix Strength"}
    }).replace(/</g,"\\u003c") }} />}
  </>;
}

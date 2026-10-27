"use client";
import type { FormEvent } from "react";
import type { PhoenixLocale, PhoenixProduct } from "@/lib/phoenix-products";
import { phoenixCategories, phoenixProducts } from "@/lib/phoenix-products";

const root = (locale: PhoenixLocale) =>
  locale === "de"
    ? "/de/geraete/phoenix-strength"
    : "/equipment/phoenix-strength";
const text = {
  en: {
    eyebrow: "Phoenix Strength",
    title: "Commercial rigs and strength equipment built around your facility.",
    intro:
      "L4Gym works with Phoenix Strength to support commercial rig projects, complete gym configurations and selected strength equipment enquiries across Europe and international markets.",
    fitout: "Discuss a Complete Gym Fit-Out",
    rig: "Configure a Commercial Rig",
    categories: "Explore the range",
    quote: "Request a Quote",
    details: "View product",
    model: "Model",
    notice:
      "Specifications, availability, delivery and commercial terms are confirmed individually. Prices are not published.",
  },
  de: {
    eyebrow: "Phoenix Strength",
    title: "Kommerzielle Rigs und Kraftgeräte passend zu Ihrer Anlage.",
    intro:
      "L4Gym arbeitet mit Phoenix Strength zusammen und unterstützt Anfragen zu kommerziellen Rig-Projekten, kompletten Studioausstattungen und ausgewählten Kraftgeräten in Europa und internationalen Märkten.",
    fitout: "Komplette Studioausstattung besprechen",
    rig: "Kommerzielles Rig konfigurieren",
    categories: "Sortiment entdecken",
    quote: "Angebot anfordern",
    details: "Produkt ansehen",
    model: "Modell",
    notice:
      "Spezifikationen, Verfügbarkeit, Lieferung und Konditionen werden individuell bestätigt. Preise werden nicht veröffentlicht.",
  },
};

export function PhoenixLanding({ locale }: { locale: PhoenixLocale }) {
  const t = text[locale];
  return (
    <>
      <section className="phoenix-hero">
        <div className="shell phoenix-hero-grid">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="lead">{t.intro}</p>
            <div className="button-row">
              <a className="button primary" href={`${root(locale)}#enquiry`}>
                {t.fitout}
              </a>
              <a
                className="button secondary"
                href={`${root(locale)}/rigs-racks`}
              >
                {t.rig}
              </a>
            </div>
          </div>
          <div className="phoenix-hero-card">
            <span>PHOENIX STRENGTH</span>
            <strong>
              {locale === "de"
                ? "Rigs zuerst. Ganze Anlagen geplant."
                : "Rigs first. Complete facilities considered."}
            </strong>
            <p>
              {locale === "de"
                ? "Australische Marke · kommerzielle Fertigung · internationale Anfragen"
                : "Australian brand · commercial manufacturing · international enquiries"}
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">{t.categories}</p>
            <h2>
              {locale === "de"
                ? "Vom einzelnen Cage bis zur kompletten Trainingsfläche."
                : "From one cage to a complete training floor."}
            </h2>
          </div>
          <div className="phoenix-category-grid">
            {phoenixCategories.map((c) => (
              <a
                className="phoenix-category"
                key={c.slug}
                href={`${root(locale)}/${c.slug}`}
              >
                <span>{locale === "de" ? c.nameDe : c.name}</span>
                <p>{locale === "de" ? c.descriptionDe : c.description}</p>
                <b>→</b>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="section phoenix-featured">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">
              {locale === "de" ? "Ausgewählte Lösungen" : "Selected solutions"}
            </p>
            <h2>
              {locale === "de"
                ? "Kommerziell relevante Produkte für den ersten Schritt."
                : "Commercially relevant equipment for the first conversation."}
            </h2>
          </div>
          <ProductGrid
            locale={locale}
            products={phoenixProducts.filter(
              (p) =>
                p.featured ||
                [
                  "hack-squat-45",
                  "lever-belt-squat",
                  "chest-supported-lever-row",
                  "z4-fid-bench",
                ].includes(p.slug),
            )}
          />
        </div>
      </section>
      <EnquirySection locale={locale} />
      <div className="shell phoenix-notice">
        <p>{t.notice}</p>
      </div>
    </>
  );
}

export function ProductGrid({
  locale,
  products,
}: {
  locale: PhoenixLocale;
  products: PhoenixProduct[];
}) {
  const t = text[locale];
  return (
    <div className="phoenix-products">
      {products.map((p) => (
        <article className="phoenix-product-card" key={p.slug}>
          <a href={`${root(locale)}/products/${p.slug}`}>
            <img
              src={p.image}
              alt={locale === "de" ? p.nameDe || p.name : p.name}
              loading="lazy"
            />
          </a>
          <div>
            <span>
              {p.model
                ? `${t.model}: ${p.model}`
                : locale === "de"
                  ? "Individuell konfiguriert"
                  : "Configured to order"}
            </span>
            <h3>
              <a href={`${root(locale)}/products/${p.slug}`}>
                {locale === "de" ? p.nameDe || p.name : p.name}
              </a>
            </h3>
            <p>{locale === "de" ? p.summaryDe : p.summary}</p>
            <div className="phoenix-card-actions">
              <a href={`${root(locale)}/products/${p.slug}`}>{t.details}</a>
              <a href={`${root(locale)}/products/${p.slug}#enquiry`}>
                {t.quote}
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function EnquirySection({
  locale,
  product,
}: {
  locale: PhoenixLocale;
  product?: PhoenixProduct;
}) {
  return (
    <section className="section phoenix-enquiry" id="enquiry">
      <div className="shell">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">
              {locale === "de" ? "Projektanfrage" : "Project enquiry"}
            </p>
            <h2>
              {product
                ? locale === "de"
                  ? `${product.nameDe || product.name} anfragen`
                  : `Enquire about ${product.name}`
                : locale === "de"
                  ? "Besprechen Sie Ihr Rig oder Ihre komplette Studioausstattung."
                  : "Discuss your rig or complete gym fit-out."}
            </h2>
          </div>
          <p>
            {locale === "de"
              ? "Teilen Sie uns die wichtigsten Projektdaten mit. Ihre E-Mail-Anwendung erstellt daraus eine strukturierte Anfrage an L4Gym."
              : "Share the essential project details. Your email application will prepare a structured enquiry to L4Gym."}
          </p>
        </div>
        <PhoenixEnquiryForm locale={locale} product={product} />
      </div>
    </section>
  );
}

function PhoenixEnquiryForm({
  locale,
  product,
}: {
  locale: PhoenixLocale;
  product?: PhoenixProduct;
}) {
  const de = locale === "de";
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Phoenix Strength enquiry — ${product ? `${product.name}${product.model ? ` (${product.model})` : ""}` : "commercial project"}`;
    const lines = [
      "Phoenix Strength qualified enquiry", "",
      `Customer / company: ${data.get("customer")}`,
      `Email: ${data.get("email")}`,
      `Country: ${data.get("country")}`,
      `Phone / WhatsApp: ${data.get("phone_whatsapp") || "Not supplied"}`,
      `Equipment interest: ${data.get("equipment_interest")}`,
      `Purchasing timeframe: ${data.get("purchasing_timeframe")}`,
      "", "Facility requirements:", String(data.get("facility_requirements")),
      "", "Source: L4Gym Phoenix Strength website",
    ];
    window.location.href = `mailto:jamie@l4gym.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }
  return (
    <form className="phoenix-form" onSubmit={prepareEmail}>
      <div>
        <label htmlFor="customer">
          {de ? "Name / Unternehmen" : "Name / company"}
        </label>
        <input id="customer" name="customer" required />
      </div>
      <div>
        <label htmlFor="email">{de ? "E-Mail" : "Email"}</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="country">{de ? "Land" : "Country"}</label>
        <input id="country" name="country" required />
      </div>
      <div>
        <label htmlFor="timeframe">
          {de ? "Kaufzeitraum" : "Purchasing timeframe"}
        </label>
        <select
          id="timeframe"
          name="purchasing_timeframe"
          required
          defaultValue=""
        >
          <option value="" disabled>
            {de ? "Bitte auswählen" : "Select one"}
          </option>
          <option>
            {de ? "Sofort / bis 3 Monate" : "Immediate / within 3 months"}
          </option>
          <option>{de ? "3 bis 6 Monate" : "3 to 6 months"}</option>
          <option>{de ? "6 bis 12 Monate" : "6 to 12 months"}</option>
          <option>{de ? "Mehr als 12 Monate" : "More than 12 months"}</option>
          <option>{de ? "Erste Planung" : "Early planning"}</option>
        </select>
      </div>
      <div className="full">
        <label htmlFor="interest">
          {de
            ? "Geräte- oder Projektinteresse"
            : "Equipment or project interest"}
        </label>
        <input
          id="interest"
          name="equipment_interest"
          required
          defaultValue={
            product
              ? `${product.name}${product.model ? ` (${product.model})` : ""}`
              : ""
          }
        />
      </div>
      <div className="full">
        <label htmlFor="requirements">
          {de ? "Anforderungen der Anlage" : "Facility requirements"}
        </label>
        <textarea
          id="requirements"
          name="facility_requirements"
          required
          rows={5}
          placeholder={
            de
              ? "Fläche, Studiotyp, gewünschte Stationen, Nutzerzahl und weitere Anforderungen"
              : "Floor area, facility type, required stations, expected users and other requirements"
          }
        />
      </div>
      <div className="full">
        <label htmlFor="phone">
          {de ? "Telefon / WhatsApp (optional)" : "Phone / WhatsApp (optional)"}
        </label>
        <input id="phone" name="phone_whatsapp" />
      </div>
      <div className="full">
        <button className="button primary" type="submit">
          {de ? "Anfrage per E-Mail vorbereiten" : "Prepare email enquiry"}
        </button>
        <p className="form-note">
          {de
            ? "Es erfolgt keine Onlinezahlung. Verfügbarkeit, Spezifikationen und Angebot werden direkt bestätigt."
            : "No online payment is taken. Availability, specifications and quotation are confirmed directly."}
        </p>
      </div>
    </form>
  );
}

export function PhoenixCategoryPage({
  locale,
  slug,
}: {
  locale: PhoenixLocale;
  slug: string;
}) {
  const category = phoenixCategories.find((c) => c.slug === slug);
  if (!category) return null;
  const products = phoenixProducts.filter((p) => p.category === slug);
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <div>
            <p className="eyebrow">Phoenix Strength</p>
            <h1>{locale === "de" ? category.nameDe : category.name}</h1>
          </div>
          <p>
            {locale === "de" ? category.descriptionDe : category.description}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <ProductGrid locale={locale} products={products} />
        </div>
      </section>
      <EnquirySection locale={locale} />
    </>
  );
}

export function PhoenixProductPage({
  locale,
  product,
}: {
  locale: PhoenixLocale;
  product: PhoenixProduct;
}) {
  const de = locale === "de";
  const name = de ? product.nameDe || product.name : product.name;
  const features = de ? product.featuresDe : product.features;
  return (
    <>
      <section className="phoenix-product-hero">
        <div className="shell phoenix-product-layout">
          <div className="phoenix-main-image">
            <img src={product.image} alt={name} />
          </div>
          <div>
            <p className="eyebrow">Phoenix Strength</p>
            <h1>{name}</h1>
            {product.model && (
              <p className="product-model">
                {de ? "Modell" : "Model"}: {product.model}
              </p>
            )}
            <p className="lead">{de ? product.summaryDe : product.summary}</p>
            <div className="button-row">
              <a className="button primary" href="#enquiry">
                {de ? "Angebot anfordern" : "Request a Quote"}
              </a>
              <a
                className="button product-secondary"
                href={`${root(locale)}/${product.category}`}
              >
                {de ? "Kategorie ansehen" : "View category"}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell phoenix-detail-grid">
          <div>
            <p className="eyebrow">
              {de ? "Produktübersicht" : "Product overview"}
            </p>
            <h2>
              {de
                ? "Für kommerzielle Trainingsbereiche."
                : "Designed for commercial training environments."}
            </h2>
            <ul className="phoenix-feature-list">
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          {product.specifications && (
            <div className="phoenix-specs">
              <h3>{de ? "Verifizierte Angaben" : "Verified specifications"}</h3>
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <EnquirySection locale={locale} product={product} />
      <div className="shell phoenix-notice">
        <p>{text[locale].notice}</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name,
            sku: product.model,
            image: [product.image],
            description: de ? product.summaryDe : product.summary,
            brand: { "@type": "Brand", name: "Phoenix Strength" },
          }),
        }}
      />
    </>
  );
}

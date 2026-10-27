import { readFileSync, existsSync } from "node:fs";

const requiredRoutes = [
  "dist/client/equipment/phoenix-strength.html",
  "dist/client/de/geraete/phoenix-strength.html",
  "dist/client/equipment/phoenix-strength/rigs-racks.html",
  "dist/client/de/geraete/phoenix-strength/rigs-racks.html",
  "dist/client/equipment/phoenix-strength/products/lcpc-pro.html",
  "dist/client/de/geraete/phoenix-strength/products/lcpc-pro.html",
];
for (const route of requiredRoutes) {
  if (!existsSync(route)) throw new Error(`Missing generated route: ${route}`);
}

const english = readFileSync(requiredRoutes[0], "utf8");
const german = readFileSync(requiredRoutes[1], "utf8");
const combined = `${english}\n${german}`;
const component = readFileSync("components/PhoenixCatalogue.tsx", "utf8");
const blueprint = readFileSync("public/phoenix-enquiry.html", "utf8");
const requiredFields = ["customer", "email", "country", "purchasing_timeframe", "equipment_interest", "facility_requirements"];
for (const field of requiredFields) {
  if (!combined.includes(`name=\"${field}\"`)) throw new Error(`Missing enquiry field: ${field}`);
}
if (!english.includes("Discuss a Complete Gym Fit-Out")) throw new Error("English fit-out CTA is missing");
if (!german.includes("Komplette Studioausstattung besprechen")) throw new Error("German fit-out CTA is missing");
if (!english.includes("/de/geraete/phoenix-strength")) throw new Error("English-to-German switch is missing");
if (!german.includes("/equipment/phoenix-strength")) throw new Error("German-to-English switch is missing");
if (/price_usd|price_source|July 2026 list|converted from|\bUSD\b|\bAUD\b/i.test(combined)) throw new Error("Internal pricing data is exposed");
if (!blueprint.includes('name="phoenix-strength-enquiry"') || !blueprint.includes('data-netlify="true"')) throw new Error("Static Netlify form blueprint is missing");
if (!component.includes('netlify-honeypot="bot-field"')) throw new Error("Honeypot protection is missing");
if (!component.includes('fetch("/phoenix-enquiry.html"')) throw new Error("Direct Netlify submission is missing");
if (component.includes("window.location.href = `mailto:")) throw new Error("Legacy mailto submission remains active");
if (!component.includes('name="privacy_consent"')) throw new Error("Privacy consent field is missing");
console.log("Phoenix catalogue validation passed.");

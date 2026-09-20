# L4Gym Public Website

Standalone corporate and marketing website for **L4Gym**. This project has no database, authentication, backend, or connection to the L4Gym gym-management application, MachineDNA backend, pilot software, or production data.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal.

## Build

```bash
npm run build
```

The static website is generated in the `dist/client` directory.

## Deploy free on Netlify

1. Create a new GitHub repository used only for this public website.
2. Push this project to that repository.
3. In Netlify, choose **Add new site → Import an existing project**.
4. Connect GitHub and select the new repository.
5. Netlify reads `netlify.toml`: build command `npm run build`, publish directory `dist/client`.
6. Deploy first to the temporary `*.netlify.app` address and review the site.
7. Do not connect the live domain until Jamie approves the design and content.

## Connect L4gym.com from Dynadot

Do this only after the Netlify preview is approved.

1. In Netlify, open **Domain management → Add a domain**.
2. Add `www.l4gym.com` as the primary domain and `l4gym.com` as an alias/redirect.
3. Netlify will display the exact DNS targets required for the site.
4. In Dynadot DNS, change only the web records requested by Netlify:
   - `www`: normally a CNAME pointing to the assigned Netlify hostname.
   - Apex `@`: normally the Netlify-recommended A records or ALIAS/flattening option shown in Netlify.
5. Leave all mail-related records unchanged.

### Email protection

Do **not** delete or replace MX, SPF, DKIM, DMARC, mail-verification, or other email records. Do not change nameservers unless there is a separately reviewed migration plan. The safest setup is to keep Dynadot DNS and edit only the `@` and `www` web records.

## HTTPS

After DNS is correct, Netlify will provision a free TLS certificate. In **Domain management → HTTPS**, verify the certificate and enable the HTTPS redirect. DNS propagation can take time.

## Pre-launch checklist

- Approve all wording, brand presentation, and page content.
- Test the temporary Netlify URL on desktop and mobile.
- Confirm `jamie@l4gym.com` works before and after DNS changes.
- Record the current Dynadot DNS zone before changing web records.
- Confirm both `https://l4gym.com` and `https://www.l4gym.com` resolve correctly.
- Confirm `robots.txt` and `sitemap.xml` load.

## Repository boundaries

Keep this repository separate. Never add production credentials, customer data, application source code, pilot software, or MachineDNA backend code.

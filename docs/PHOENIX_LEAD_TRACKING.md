# Phoenix Strength lead attribution

Phoenix website enquiries are captured by the Netlify form `phoenix-strength-enquiry`. The form is an initial lead register, not a CRM.

## Attribution fields

- `lead_reference`: unique browser-generated reference beginning `L4G-PHX-`
- `submitted_at`: ISO-8601 submission timestamp
- `lead_source`: `l4gym-phoenix-catalogue`
- `sales_channel`: `l4gym.com`
- `l4gym_attribution`: `Introduced by L4Gym / Jamie Bevan`
- `language`: `en` or `de`
- `request_type`: catalogue, quotation, rig, fit-out, product, distributor, or general enquiry
- `product_name` and `product_sku`: product context where available
- `customer_name`, `company`, `email`, `phone_whatsapp`, and `country`
- `equipment_interest`, `facility_requirements`, and `purchasing_timeframe`
- `opportunity_stage`: initially `new_website_lead`
- `introduction_status`: initially `captured_by_l4gym`
- `commission_status`: initially `not_yet_applicable`

## Simple operating record

Export submissions from Netlify as CSV and retain `lead_reference` as the permanent key. Add operational columns outside the website form for:

- Phoenix introduction date
- Phoenix contact / recipient
- Qualification status
- Opportunity stage: `new`, `qualified`, `introduced_to_phoenix`, `quotation_requested`, `quotation_issued`, `negotiation`, `order_confirmed`, `won`, or `lost`
- Quotation reference and date
- Order reference and date
- Commission status: `not_yet_applicable`, `expected`, `invoiced`, `paid`, or `disputed`
- Next action, next action date, owner, and notes

The website must not expose these internal tracking fields, pricing, quotations, orders, or commission information to customers.

## Full catalogue release

The public website records full-catalogue requests but does not automatically expose a manufacturer document. L4Gym should send only a version confirmed by Phoenix Strength as approved for customer distribution. The supplied web PDF contains Phoenix Strength's direct contact details, so automatic delivery could bypass L4Gym attribution and should remain disabled until a suitable distribution version and process are approved.

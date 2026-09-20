import Image from "next/image";
import { ArrowRight, Check, Factory, Network, QrCode, Settings, Wrench } from "lucide-react";

const audiences = [
  { title: "Gyms", text: "Bring equipment records, fault reporting and operational visibility into one connected lifecycle.", href: "/what-we-do", label: "For gym operators" },
  { title: "Manufacturers", text: "Connect every machine to a persistent digital identity from production through service and resale.", href: "/manufacturers-oem", label: "For manufacturers" },
  { title: "Distributors", text: "Support equipment beyond delivery with clearer records and a stronger service connection.", href: "/distributors-partners", label: "For distributors" },
  { title: "Service partners", text: "Turn reported faults into structured technical work with the right machine context attached.", href: "/service-support", label: "For service partners" },
];
const lifecycle = ["Identified", "Installed", "Operated", "Serviced", "Transferred"];

export default function Home() {
  return <>
    <section className="hero"><div className="shell hero-grid">
      <div className="hero-copy"><p className="eyebrow">Connected fitness equipment infrastructure</p><h1>One connected lifecycle for every machine.</h1><p className="lead">L4Gym is building the infrastructure that connects fitness equipment, gym operations and technical service — from installation to repair, resale and beyond.</p><div className="button-row"><a className="button primary" href="/what-we-do">Explore L4Gym <ArrowRight size={18}/></a><a className="button secondary" href="mailto:jamie@l4gym.com">Discuss a partnership</a></div></div>
      <div className="hero-system" aria-label="L4Gym equipment lifecycle overview"><div className="system-heading"><span>MachineDNA</span><small>Equipment identity layer</small></div><div className="machine-card"><div className="machine-top"><div className="qr"><QrCode size={44}/></div><div><b>L4-00018452</b><span>Connected equipment record</span></div></div><div className="status-line"><i></i> Lifecycle record active</div></div><div className="lifecycle-line">{lifecycle.map((item, i) => <div key={item}><span>{i+1}</span><small>{item}</small></div>)}</div><div className="system-footer"><span><Settings size={17}/> Operations</span><span><Wrench size={17}/> Service</span><span><Network size={17}/> Partners</span></div></div>
    </div></section>
    <section className="proof-strip"><div className="shell proof-inner"><p>Built around the machine — not another disconnected system.</p><div><span>QR-linked identity</span><span>Lifecycle history</span><span>Service connection</span></div></div></section>
    <section className="section shell"><div className="section-heading split"><div><p className="eyebrow">The operating layer</p><h2>Equipment is the common thread.</h2></div><p>Machines move through manufacturers, distributors, gyms, technicians and new owners. L4Gym is designed to keep the right information connected through that journey.</p></div><div className="three-grid">
      <article className="feature dark"><QrCode/><p className="kicker">01 / Identify</p><h3>Give each machine a persistent identity.</h3><p>MachineDNA links an equipment record to a durable QR code for quick, permission-aware access.</p><a href="/machinedna">Explore MachineDNA <ArrowRight size={16}/></a></article>
      <article className="feature"><Wrench/><p className="kicker">02 / Maintain</p><h3>Connect faults to technical action.</h3><p>Structured reporting helps service teams understand the machine, issue and history before work begins.</p><a href="/service-support">Service and support <ArrowRight size={16}/></a></article>
      <article className="feature"><Factory/><p className="kicker">03 / Extend</p><h3>Support the whole equipment lifecycle.</h3><p>Installation, servicing, ownership changes and resale can contribute to one continuous machine record.</p><a href="/equipment">Equipment lifecycle <ArrowRight size={16}/></a></article>
    </div></section>
    <section className="section product-preview"><div className="shell">
      <div className="section-heading split"><div><p className="eyebrow">Product development</p><h2>One platform across operations and service.</h2></div><p>Current L4Gym interface previews show how gym owners, members and technical teams can work around the same equipment context while retaining role-specific views.</p></div>
      <div className="preview-stack">
        <figure className="preview-frame"><Image src="/l4gym-platform-overview.webp" alt="L4Gym platform preview showing owner, member and technician experiences" width={1800} height={1200}/><figcaption><b>Connected platform overview</b><span>Owner operations, member experience and FitOps service tools.</span></figcaption></figure>
        <figure className="preview-frame"><Image src="/l4gym-fitops-workflow.webp" alt="L4Gym FitOps technician workflow from service jobs through repair evidence and return to service" width={1800} height={1200}/><figcaption><b>FitOps technician workflow</b><span>From assigned work and equipment history to repair reporting and return to service.</span></figcaption></figure>
      </div>
      <p className="preview-note">Product-development previews. Interface, features and example data are subject to change and do not represent customer results.</p>
    </div></section>
    <section className="section audience-section"><div className="shell"><div className="section-heading"><p className="eyebrow">Built for the commercial fitness chain</p><h2>A shared infrastructure. Different commercial value.</h2></div><div className="audience-grid">{audiences.map((a,i)=><a href={a.href} className="audience-card" key={a.title}><span>0{i+1}</span><h3>{a.title}</h3><p>{a.text}</p><b>{a.label} <ArrowRight size={16}/></b></a>)}</div></div></section>
    <section className="section shell two-column"><div><p className="eyebrow">A practical commercial direction</p><h2>Software, equipment and service working as one ecosystem.</h2></div><div className="check-list">{["Gym operations with equipment context","QR-linked digital machine records","Fault reporting and service workflows","Manufacturer and OEM integration","Commercial equipment and private label opportunities","Resale and lifecycle continuity"].map(x=><div key={x}><Check size={18}/><span>{x}</span></div>)}</div></section>
  </>;
}

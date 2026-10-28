export type PhoenixLocale = "en" | "de";

export type PhoenixProduct = {
  slug: string;
  category: "rigs-racks" | "strength-machines" | "benches-accessories";
  name: string;
  nameDe?: string;
  model?: string;
  summary: string;
  summaryDe: string;
  image: string;
  images?: string[];
  features: string[];
  featuresDe: string[];
  specifications?: Record<string, string>;
  featured?: boolean;
};

export const phoenixCategories = [
  {
    slug: "rigs-racks",
    name: "Rigs, racks & cages",
    nameDe: "Rigs, Racks & Cages",
    description:
      "Commercial cages and modular rig systems configured around your space and training model.",
    descriptionDe:
      "Kommerzielle Cages und modulare Rig-Systeme, abgestimmt auf Fläche und Trainingskonzept.",
  },
  {
    slug: "strength-machines",
    name: "Strength machines",
    nameDe: "Kraftgeräte",
    description:
      "A selected range of photographed plate-loaded and pin-loaded commercial machines.",
    descriptionDe:
      "Eine ausgewählte Reihe fotografierter, kommerzieller Plate-Loaded- und Pin-Loaded-Geräte.",
  },
  {
    slug: "benches-accessories",
    name: "Benches & accessories",
    nameDe: "Bänke & Zubehör",
    description:
      "Complementary benches, storage and functional training equipment.",
    descriptionDe:
      "Ergänzende Bänke, Aufbewahrungslösungen und Functional-Training-Zubehör.",
  },
] as const;

export const phoenixProducts: PhoenixProduct[] = [
  {
    slug: "commercial-rig-systems",
    category: "rigs-racks",
    name: "Commercial Rig Systems",
    nameDe: "Kommerzielle Rig-Systeme",
    summary:
      "Configurable free-standing, wall-mounted and custom rig systems for commercial training facilities.",
    summaryDe:
      "Konfigurierbare freistehende, wandmontierte und kundenspezifische Rig-Systeme für kommerzielle Trainingsanlagen.",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/AP1GczNg7eaUZhOBNaKhKNzGT3y-diluK7l_kfjSU9H3Fk4eNzwuJ8y8o0OsiNZuwKf6ohIhAjcuY3D8LbAMMDt7yMmrBzvuuRs8OYEQglLwi9yWswTID9fW5aEZgbWgEpYFvwMNS6pXUF20jXvoEZg0btxW24n823xyGAAnQ2iuW7qNbV-iKcN_57b03275-eeec-4efa-b816-a4e2fab692a3.jpg",
    features: [
      "Free-standing, wall-mounted and custom configurations",
      "Standard and wide-depth options",
      "Modular construction designed to expand",
      "Custom layouts and powder-coat colours available",
    ],
    featuresDe: [
      "Freistehende, wandmontierte und individuelle Konfigurationen",
      "Standard- und Breitenausführungen",
      "Modularer Aufbau für spätere Erweiterungen",
      "Individuelle Layouts und Pulverbeschichtungen verfügbar",
    ],
    specifications: {
      Uprights: "75 x 75 mm SHS; 4 mm Premium or 3 mm Standard",
      Holes: "25 mm diameter at 25 mm centres",
      Heights: "2500 / 2750 / 3000 / 3500 mm",
      Depth: "1080 mm standard or 1800 mm wide",
    },
    featured: true,
  },
  {
    slug: "lcpc-pro",
    category: "rigs-racks",
    name: "LCPC Pro",
    summary:
      "An integrated commercial power cage, plate-loaded lat pulldown and seated row with an optional cable crossover.",
    summaryDe:
      "Ein integriertes kommerzielles Power Cage mit plate-loaded Latzug und Rudereinheit sowie optionalem Kabelzug.",
    model: "LCPC-1",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/LCPC_w__cable_crossover_kit_attachment_Dimensions.png",
    features: [
      "Power cage, lat pulldown and seated row in one footprint",
      "Optional cable crossover attachment",
      "J-hooks, safety arms and multi-grip pull-up bar",
      "Plate-loaded cable carriage",
    ],
    featuresDe: [
      "Power Cage, Latzug und Rudereinheit auf einer Stellfläche",
      "Optionaler Kabelzug-Anbau",
      "J-Hooks, Sicherheitsarme und Multi-Grip-Klimmzugstange",
      "Plate-loaded Kabelschlitten",
    ],
    specifications: {
      Size: "2354.5 H x 1407 W x 1730 D mm",
      Frame: "60 x 60 x 2 mm commercial-grade steel",
      Sleeves: "50 mm Olympic",
      Configuration: "Plate loaded",
    },
    featured: true,
  },
  {
    slug: "pspx2-half-cage",
    category: "rigs-racks",
    name: "PSPX2 Half Cage",
    summary:
      "A commercial open-front half cage for studios, warehouse gyms and strength facilities.",
    summaryDe:
      "Ein kommerzielles Half Cage mit offener Front für Studios, Warehouse Gyms und Kraftsportanlagen.",
    model: "PSPX2",
    image: "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/PSPX_03_1.jpg",
    features: [
      "Open-front access",
      "Modular attachment compatibility",
      "Commercial heavy-gauge steel",
      "Suitable for high-use training environments",
    ],
    featuresDe: [
      "Offener Zugang von vorn",
      "Kompatibel mit modularen Anbauteilen",
      "Schwerer Stahl für den kommerziellen Einsatz",
      "Für intensiv genutzte Trainingsbereiche geeignet",
    ],
    specifications: {
      "Load rating": "500 kg",
      Weight: "172 kg",
      Configuration: "Half cage",
    },
    featured: true,
  },
  {
    slug: "hd-squat-stand",
    category: "rigs-racks",
    name: "HD Squat Stand",
    summary:
      "Space-efficient commercial squat stands for squat, bench press and overhead pressing.",
    summaryDe:
      "Platzsparende kommerzielle Squat Stands für Kniebeugen, Bankdrücken und Schulterdrücken.",
    model: "HDSS",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/hdsquatstand-21.jpg",
    features: [
      "Freestanding pair",
      "Height adjustable",
      "Includes safety bars",
      "Heavy-gauge powder-coated steel",
    ],
    featuresDe: [
      "Freistehendes Paar",
      "Höhenverstellbar",
      "Mit Sicherheitsablagen",
      "Schwerer, pulverbeschichteter Stahl",
    ],
  },
  {
    slug: "hack-squat-45",
    category: "strength-machines",
    name: "Hack Squat 45",
    summary:
      "A commercial 45-degree plate-loaded hack squat for lower-body training.",
    summaryDe:
      "Eine kommerzielle plate-loaded 45-Grad-Hackenschmidtmaschine für das Beintraining.",
    model: "HS45",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/phoenix-hs45-1.jpg",
    features: [
      "Plate-loaded design",
      "45-degree movement path",
      "Commercial strength application",
    ],
    featuresDe: [
      "Plate-loaded Konstruktion",
      "45-Grad-Bewegungsbahn",
      "Für kommerzielles Krafttraining",
    ],
  },
  {
    slug: "lever-belt-squat",
    category: "strength-machines",
    name: "Lever Belt Squat",
    summary:
      "A plate-loaded belt squat designed for lower-body loading without placing a bar on the shoulders.",
    summaryDe:
      "Eine plate-loaded Belt-Squat-Maschine für Beintraining ohne Langhantelbelastung auf den Schultern.",
    model: "LBS",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/phoenix-lbs-1.jpg",
    features: [
      "Plate-loaded resistance",
      "Belt-squat movement",
      "Commercial training use",
    ],
    featuresDe: [
      "Plate-loaded Widerstand",
      "Belt-Squat-Bewegung",
      "Für kommerzielles Training",
    ],
  },
  {
    slug: "lever-leg-press",
    category: "strength-machines",
    name: "Lever Leg Press",
    summary:
      "A commercial plate-loaded lever leg press for high-volume lower-body training.",
    summaryDe:
      "Eine kommerzielle plate-loaded Lever-Beinpresse für umfangreiches Beintraining.",
    model: "LLP",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/pllp_teaser_1_af0107e6-4f49-4198-b10b-8c7ab1a47c0f.png",
    features: [
      "Lever-driven movement",
      "Plate-loaded resistance",
      "Commercial lower-body station",
    ],
    featuresDe: [
      "Hebelgeführte Bewegung",
      "Plate-loaded Widerstand",
      "Kommerzielle Beinstation",
    ],
  },
  {
    slug: "pendulum-squat-v2",
    category: "strength-machines",
    name: "Pendulum Squat V2",
    summary:
      "A plate-loaded pendulum squat for controlled lower-body strength work.",
    summaryDe:
      "Eine plate-loaded Pendulum-Squat-Maschine für kontrolliertes Beintraining.",
    model: "PDS2",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/cz-pendulum-squat-machine-australia_bf9264df-b1b5-4239-9dc3-789a4e62ab29.jpg",
    features: [
      "Pendulum movement path",
      "Plate-loaded resistance",
      "Commercial strength application",
    ],
    featuresDe: [
      "Pendel-Bewegungsbahn",
      "Plate-loaded Widerstand",
      "Für kommerzielles Krafttraining",
    ],
  },
  {
    slug: "chest-supported-lever-row",
    category: "strength-machines",
    name: "Chest Supported Lever Row",
    summary:
      "A chest-supported plate-loaded row for focused upper-back training.",
    summaryDe:
      "Ein brustgestütztes plate-loaded Rudergerät für gezieltes Rückentraining.",
    model: "CSLR",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/cz-chest-supported-lever-row-machine_db41bbea-663a-4be3-aa57-f51d1eec8e42.jpg",
    features: [
      "Chest-supported position",
      "Lever-driven movement",
      "Plate-loaded resistance",
    ],
    featuresDe: [
      "Brustgestützte Position",
      "Hebelgeführte Bewegung",
      "Plate-loaded Widerstand",
    ],
  },
  {
    slug: "ultra-row",
    category: "strength-machines",
    name: "Ultra Row",
    summary:
      "A commercial plate-loaded rowing machine for upper-back strength development.",
    summaryDe:
      "Ein kommerzielles plate-loaded Rudergerät für den Aufbau der Rückenmuskulatur.",
    model: "UR",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/1u3m3TDk_iXPshBxlo7CFVgXnI7Jwrgnh_w1600_30e8c7a6-f1dc-4728-96fc-8172d6b24f21.jpg",
    features: [
      "Plate-loaded resistance",
      "Commercial rowing station",
      "Built for strength-focused facilities",
    ],
    featuresDe: [
      "Plate-loaded Widerstand",
      "Kommerzielle Ruderstation",
      "Für kraftorientierte Anlagen",
    ],
  },
  {
    slug: "chest-press-adjustable",
    category: "strength-machines",
    name: "Chest Press Adjustable",
    summary: "An adjustable commercial plate-loaded chest press.",
    summaryDe: "Eine verstellbare kommerzielle plate-loaded Brustpresse.",
    model: "CP",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/phoenix-cp-1.jpg",
    features: [
      "Adjustable pressing position",
      "Plate-loaded resistance",
      "Commercial upper-body station",
    ],
    featuresDe: [
      "Verstellbare Druckposition",
      "Plate-loaded Widerstand",
      "Kommerzielle Oberkörperstation",
    ],
  },
  {
    slug: "lateral-raise",
    category: "strength-machines",
    name: "Lateral Raise",
    summary:
      "A commercial strength machine for controlled lateral shoulder training.",
    summaryDe:
      "Ein kommerzielles Kraftgerät für kontrolliertes seitliches Schultertraining.",
    model: "LR",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/cz-lateral-raise-pin-loaded-red-arms-2_afacf11d-cd7c-4e26-9886-5491c80eaadc.jpg",
    features: [
      "Controlled shoulder movement",
      "Commercial construction",
      "Dedicated lateral-raise station",
    ],
    featuresDe: [
      "Kontrollierte Schulterbewegung",
      "Kommerzielle Konstruktion",
      "Spezielle Seithebestation",
    ],
  },
  {
    slug: "functional-trainer-ultra",
    category: "strength-machines",
    name: "Functional Trainer Ultra",
    summary:
      "A commercial functional trainer for varied cable-based strength work.",
    summaryDe:
      "Ein kommerzieller Functional Trainer für vielseitiges kabelbasiertes Krafttraining.",
    model: "FTP",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/1yhcVf3WbzfY3K2SP9XNuXB-SeGM80yCj_w1600_b5a01092-ca52-4651-a2c6-569935f36251.jpg",
    features: [
      "Multi-exercise cable station",
      "Commercial training application",
      "Flexible programming options",
    ],
    featuresDe: [
      "Kabelstation für zahlreiche Übungen",
      "Für kommerzielles Training",
      "Flexible Trainingsmöglichkeiten",
    ],
  },
  {
    slug: "z4-fid-bench",
    category: "benches-accessories",
    name: "Z4 FID Bench",
    summary:
      "A flat, incline and decline adjustable bench for commercial strength areas.",
    summaryDe:
      "Eine verstellbare Flach-, Schräg- und Negativbank für kommerzielle Kraftbereiche.",
    model: "Z4B-1",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/20240525_203434_png.png",
    features: [
      "Flat, incline and decline adjustment",
      "Commercial strength use",
      "Pairs with racks and free weights",
    ],
    featuresDe: [
      "Flach-, Schräg- und Negativverstellung",
      "Für kommerzielles Krafttraining",
      "Passend zu Racks und freien Gewichten",
    ],
  },
  {
    slug: "power-bands",
    category: "benches-accessories",
    name: "Power Bands",
    summary:
      "Resistance bands for assisted, resisted and mobility-focused training.",
    summaryDe:
      "Widerstandsbänder für unterstütztes Training, Zusatzwiderstand und Mobilität.",
    model: "POBA-G",
    image:
      "https://cdn.shopify.com/s/files/1/0692/6021/4329/files/2_11612f68-3a7e-4fb1-9f69-625c83035ac4.png",
    features: [
      "Multiple resistance options",
      "Strength and mobility applications",
      "Useful across rig and functional areas",
    ],
    featuresDe: [
      "Mehrere Widerstandsstufen",
      "Für Kraft- und Mobilitätstraining",
      "Vielseitig an Rigs und in Functional-Bereichen",
    ],
  },
];

export function getPhoenixProduct(slug: string) {
  return phoenixProducts.find((product) => product.slug === slug);
}
export function getPhoenixCategory(slug: string) {
  return phoenixCategories.find((category) => category.slug === slug);
}

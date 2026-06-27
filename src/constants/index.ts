import { District, Hotspot, TimelineItem } from '../types';

export const DISTRICT_DATA: Record<string, District> = {
  korba: {
    name: "Korba",
    type: "Coal Mining Corridor",
    pm10: 185,
    pm25: 82,
    trucks: 12500,
    pop: "1.2 Lakhs (Urban Core)",
    settle: "82%",
    roi: "258%",
    desc: "Major coal mining hub (SECL open-cast mines Dipka, Gevra, Kusmunda) with intensive heavy tipper movements. Experiences severe road silt loading and winter smog.",
    colorClass: "level-vpoor"
  },
  raipur: {
    name: "Raipur",
    type: "Industrial Capital Hub",
    pm10: 210,
    pm25: 95,
    trucks: 9800,
    pop: "12.0 Lakhs (Metropolitan)",
    settle: "78%",
    roi: "245%",
    desc: "Capital district housing sponge iron units, steel rolling mills (Siltara & Urla). High density of multi-axle freight carriers compounding road dust resuspension.",
    colorClass: "level-vpoor"
  },
  raigarh: {
    name: "Raigarh",
    type: "Coal & Power Belt",
    pm10: 165,
    pm25: 74,
    trucks: 7400,
    pop: "2.5 Lakhs (Corridor Zone)",
    settle: "80%",
    roi: "235%",
    desc: "Industrial corridor experiencing substantial heavy vehicle cargo spillage (coal, iron ore) along Gharghoda-Raigarh corridor, creating ultra-fine road dust silt.",
    colorClass: "level-poor"
  },
  durg: {
    name: "Durg-Bhilai",
    type: "Heavy Manufacturing Zone",
    pm10: 145,
    pm25: 65,
    trucks: 8500,
    pop: "10.5 Lakhs (Metropolitan)",
    settle: "74%",
    roi: "215%",
    desc: "Steel manufacturing hub dominated by Bhilai Steel Plant supply chain transport. High density of heavy raw material and finished steel haulers.",
    colorClass: "level-poor"
  },
  bilaspur: {
    name: "Bilaspur",
    type: "Logistics & Cement Corridor",
    pm10: 130,
    pm25: 58,
    trucks: 6200,
    pop: "4.8 Lakhs (Urban Area)",
    settle: "75%",
    roi: "220%",
    desc: "Nodal point for railway cargo loading and cement raw material logistics. Continuous flow of bulk carrier trucks generating wake-lifted dust on NH-130.",
    colorClass: "level-mod"
  },
  surguja: {
    name: "Surguja (Ambikapur)",
    type: "Bauxite & Coal Mining",
    pm10: 95,
    pm25: 42,
    trucks: 4100,
    pop: "1.4 Lakhs (Urban)",
    settle: "85%",
    roi: "240%",
    desc: "Northern mining district. High traffic of mineral haulers transport coal to thermal units. Undulating topography increases engine torque and wake shear.",
    colorClass: "level-mod"
  },
  bastar: {
    name: "Bastar (Jagdalpur)",
    type: "Iron Ore Transport Belt",
    pm10: 75,
    pm25: 35,
    trucks: 3200,
    pop: "1.5 Lakhs (Urban)",
    settle: "88%",
    roi: "262%",
    desc: "Southern forest belt with NMDC iron ore operations. Road dust consists of red iron-rich laterite silt, causing significant visual and environmental impacts.",
    colorClass: "level-good"
  }
};

export const HOTSPOT_DATA: Hotspot[] = [
  { location: "Urga-Korba Coal Highway", district: "Korba", pm10: 245, status: "Critical", class: "text-danger" },
  { location: "Siltara Industrial Bypass", district: "Raipur", pm10: 230, status: "Critical", class: "text-danger" },
  { location: "Gharghoda Coal Corridor", district: "Raigarh", pm10: 195, status: "High Risk", class: "text-warning" },
  { location: "Urla Heavy Vehicle Ring", district: "Raipur", pm10: 190, status: "High Risk", class: "text-warning" },
  { location: "Nandini Road Steel Corridor", district: "Bhilai-Durg", pm10: 165, status: "Moderate", class: "text-accent" },
  { location: "Tifra Logistics Highway", district: "Bilaspur", pm10: 142, status: "Moderate", class: "text-accent" }
];

export const TIMELINE_DATA: TimelineItem[] = [
  {
    title: "Prototype Development",
    description: "Wind tunnel testing & design optimization (Completed Q4 2025)",
    status: "completed"
  },
  {
    title: "Korba Pit Pilot",
    description: "10-truck mine dumper pilot deployment (Ongoing Q1-Q2 2026)",
    status: "active"
  },
  {
    title: "CECB State-wide Mandate",
    description: "Phased retrofitting mandate in mining belts (Target Q4 2026)",
    status: "future"
  }
];

export const DISTRICT_MAP_PATHS = [
  { key: "surguja", label: "Surguja (Ambikapur)", path: "M 150,80 L 220,70 L 250,110 L 190,140 L 140,110 Z" },
  { key: "korba", label: "Korba Corridor", path: "M 160,150 L 220,145 L 245,190 L 180,210 L 145,180 Z" },
  { key: "raigarh", label: "Raigarh Power Belt", path: "M 225,145 L 285,150 L 290,220 L 235,215 Z" },
  { key: "bilaspur", label: "Bilaspur Logistics", path: "M 115,160 L 155,155 L 175,205 L 135,225 L 105,195 Z" },
  { key: "raipur", label: "Raipur Industrial Hub", path: "M 130,230 L 185,220 L 205,280 L 150,300 L 120,270 Z" },
  { key: "durg", label: "Durg-Bhilai Steel City", path: "M 75,225 L 125,230 L 115,285 L 65,270 L 60,240 Z" },
  { key: "bastar", label: "Bastar Iron Ore Belt", path: "M 95,390 L 180,360 L 205,430 L 140,520 L 80,470 Z" }
];

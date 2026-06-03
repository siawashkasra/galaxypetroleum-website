import type {
  CompanyInfo,
  Product,
  Service,
  SourceCountry,
  BorderCrossing,
  JourneyRoute,
  Project,
  TeamMember,
  Testimonial,
  Stat,
  JourneySourceCountryData,
  JourneyCrossing,
  JourneyImpactStat,
} from './types'

export const company: CompanyInfo = {
  name: 'Galaxy Petroleum',
  tagline: "Fueling Afghanistan's Future",
  founded: '2023',
  headquarters: 'Kabul, Afghanistan',
  phone: '+93 XXX XXX XXXX',
  whatsapp: '+93XXXXXXXXX',
  email: 'info@galaxypetroleum.com',
  address: 'Kabul, Afghanistan',
  about:
    "Galaxy Petroleum is Afghanistan's premier petroleum import and distribution company. Founded in 2023, we have rapidly established ourselves as a trusted partner for businesses and communities across the country — delivering high-quality fuel products through a robust supply chain that spans six nations and four strategic border crossings.",
}

export const stats: Stat[] = [
  { value: 100, suffix: '+', label: 'Employees' },
  { value: 3000, suffix: '+', label: 'Projects Completed' },
  { value: 60, suffix: '+', label: 'Global Partners' },
  { value: 6, suffix: '', label: 'Source Countries' },
]

export const products: Product[] = [
  {
    id: 'ai-92',
    name: 'Petrol AI 92',
    grade: 'RON 92',
    description:
      'Premium grade unleaded petrol engineered for modern passenger vehicles. Delivers optimal engine performance, cleaner combustion, and superior fuel efficiency.',
    specs: [
      { label: 'Octane Rating', value: 'RON 92' },
      { label: 'Type', value: 'Unleaded' },
      { label: 'Application', value: 'Passenger vehicles, light commercial' },
      { label: 'Standard', value: 'Euro 4 equivalent' },
    ],
    image:
      'https://images.unsplash.com/photo-1695018854387-9713ef1954c0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ai-95',
    name: 'Petrol AI 95',
    grade: 'RON 95',
    description:
      'High-performance unleaded petrol for modern engines requiring superior combustion efficiency. Ideal for passenger vehicles, light commercial fleets, and high-load applications.',
    specs: [
      { label: 'Octane Rating', value: 'RON 95' },
      { label: 'Type', value: 'Unleaded' },
      { label: 'Application', value: 'Passenger vehicles, light commercial, generators' },
      { label: 'Standard', value: 'Euro 5 equivalent' },
    ],
    image:
      'https://images.unsplash.com/photo-1644246905181-c3753e9a82bd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'diesel',
    name: 'Diesel',
    grade: 'EN 590',
    description:
      'High-performance diesel fuel for commercial transport, construction equipment, and industrial operations. Low sulfur content ensures compliance and engine longevity.',
    specs: [
      { label: 'Standard', value: 'EN 590' },
      { label: 'Sulfur Content', value: 'Low sulfur' },
      { label: 'Application', value: 'Heavy vehicles, construction, industrial' },
      { label: 'Cetane Number', value: '51 min' },
    ],
    image:
      'https://images.unsplash.com/photo-1653886230879-56aa325a2419?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'lpg',
    name: 'LPG',
    grade: 'HD-5',
    description:
      'Liquefied Petroleum Gas for domestic, commercial, and industrial use. Clean-burning, efficient, and safe — a versatile energy solution for homes and businesses.',
    specs: [
      { label: 'Grade', value: 'HD-5' },
      { label: 'Type', value: 'Propane / Butane mix' },
      { label: 'Application', value: 'Domestic, commercial, industrial' },
      { label: 'Packaging', value: 'Cylinders & bulk tankers' },
    ],
    image:
      'https://images.unsplash.com/photo-1644217209694-5ca176114adb?auto=format&fit=crop&w=1200&q=80',
  },
]

export const services: Service[] = [
  {
    id: 'energy-provision',
    title: 'Energy Provision',
    description:
      'Reliable, large-volume fuel supply tailored to the demands of businesses, government entities, and infrastructure projects across Afghanistan.',
    icon: 'Zap',
  },
  {
    id: 'logistics',
    title: 'Logistics & Distribution',
    description:
      'End-to-end supply chain management from source country to final delivery point — including cross-border transport, customs clearance, and last-mile delivery.',
    icon: 'Truck',
  },
  {
    id: 'quality-assurance',
    title: 'Quality Assurance',
    description:
      'Every shipment is tested and certified against international standards before delivery. We guarantee the grade and purity of every product we supply.',
    icon: 'ShieldCheck',
  },
  {
    id: 'market-analysis',
    title: 'Market Intelligence',
    description:
      'Real-time oil market analysis and price advisory services to help our clients make informed procurement decisions in a volatile global market.',
    icon: 'BarChart3',
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain Management',
    description:
      'Strategic sourcing across six countries ensures supply continuity. We mitigate risk through diversified procurement channels and bonded storage facilities.',
    icon: 'Network',
  },
  {
    id: 'sustainable',
    title: 'Sustainable Practices',
    description:
      'Committed to responsible energy distribution — minimising environmental impact at every stage, from source selection to delivery protocols.',
    icon: 'Leaf',
  },
]

export const sourceCountries: SourceCountry[] = [
  {
    id: 'russia',
    name: 'Russia',
    flag: '🇷🇺',
    description:
      "One of the world's largest petroleum exporters. Galaxy sources crude derivatives and refined products from established Russian suppliers.",
    products: ['Diesel', 'Petrol AI 92', 'LPG'],
    coordinates: { x: 62, y: 18 },
  },
  {
    id: 'belarus',
    name: 'Belarus',
    flag: '🇧🇾',
    description:
      "A key refining hub in Eastern Europe. Belarusian refineries produce high-quality petroleum products distributed through Galaxy's network.",
    products: ['Diesel', 'Petrol AI 95'],
    coordinates: { x: 52, y: 22 },
  },
  {
    id: 'azerbaijan',
    name: 'Azerbaijan',
    flag: '🇦🇿',
    description:
      'A historic petroleum nation on the Caspian Sea. Azerbaijan provides refined fuel products via well-established overland and pipeline routes.',
    products: ['Petrol AI 92', 'Diesel'],
    coordinates: { x: 56, y: 30 },
  },
  {
    id: 'iraq',
    name: 'Iraq',
    flag: '🇮🇶',
    description:
      "Home to some of the world's largest oil reserves. Iraq is a primary source for diesel and heavy fuel products in Galaxy's portfolio.",
    products: ['Diesel', 'LPG'],
    coordinates: { x: 54, y: 36 },
  },
  {
    id: 'turkmenistan',
    name: 'Turkmenistan',
    flag: '🇹🇲',
    description:
      'Rich in natural gas and petroleum, Turkmenistan is a direct overland neighbour with strategic border access into Afghanistan.',
    products: ['Petrol AI 95', 'Diesel', 'LPG'],
    coordinates: { x: 64, y: 34 },
  },
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    flag: '🇺🇿',
    description:
      "A growing refining capacity and central location make Uzbekistan a vital link in Galaxy's Central Asian supply chain.",
    products: ['Petrol AI 92', 'Diesel'],
    coordinates: { x: 67, y: 30 },
  },
]

export const borderCrossings: BorderCrossing[] = [
  {
    id: 'hairatan',
    name: 'Hairatan',
    region: 'Northern Afghanistan',
    description:
      "Afghanistan's primary northern border crossing on the Amu Darya river. The main entry point for fuel from Uzbekistan, Turkmenistan, and Russia.",
    coordinates: { x: 68, y: 42 },
  },
  {
    id: 'islam-qala',
    name: 'Islam Qala',
    region: 'Western Afghanistan',
    description:
      'The principal western crossing point on the Iran-Afghanistan border, also serving transit cargo from Azerbaijan and Iraq.',
    coordinates: { x: 53, y: 46 },
  },
  {
    id: 'tor-ghondi',
    name: 'Tor Ghondi',
    region: 'Western Afghanistan',
    description:
      'A key border crossing connecting Afghanistan to Turkmenistan, enabling direct fuel transit from the Caspian region.',
    coordinates: { x: 57, y: 44 },
  },
  {
    id: 'rozanaq',
    name: 'Rozanaq',
    region: 'Northern Afghanistan',
    description:
      'A northern border crossing facilitating trade with Uzbekistan, playing a critical role in the distribution of refined petroleum into Afghan territory.',
    coordinates: { x: 70, y: 40 },
  },
]

export const journeyRoutes: JourneyRoute[] = [
  { from: 'russia', to: 'hairatan' },
  { from: 'russia', to: 'rozanaq' },
  { from: 'belarus', to: 'hairatan' },
  { from: 'azerbaijan', to: 'islam-qala' },
  { from: 'iraq', to: 'islam-qala' },
  { from: 'turkmenistan', to: 'tor-ghondi' },
  { from: 'turkmenistan', to: 'hairatan' },
  { from: 'uzbekistan', to: 'hairatan' },
  { from: 'uzbekistan', to: 'rozanaq' },
]

export const projects: Project[] = [
  {
    id: 'kabul-distribution',
    title: 'Kabul Metro Fuel Network',
    category: 'Distribution',
    description:
      'Establishing a city-wide fuel distribution network across Kabul, serving over 200 commercial clients with reliable daily supply.',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1656988826404-bbb5ccb779bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'northern-corridor',
    title: 'Northern Supply Corridor',
    category: 'Infrastructure',
    description:
      'A dedicated supply corridor from Hairatan to Kunduz, reducing delivery time by 40% and increasing monthly throughput capacity.',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1712237453935-d9da69d2ffb2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'lpg-expansion',
    title: 'National LPG Expansion',
    category: 'Energy Access',
    description:
      'Expanding LPG availability across 12 provinces, providing clean cooking and heating fuel to thousands of households and small businesses.',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1664396113489-e50bddd4a777?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'generator-supply',
    title: 'Emergency Generator Fuel Program',
    category: 'Emergency Services',
    description:
      'Dedicated fuel supply contracts with hospitals, telecommunications infrastructure, and critical government facilities across Afghanistan.',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1759692071712-adc78a8516c8?auto=format&fit=crop&w=1200&q=80',
  },
]

export const team: TeamMember[] = [
  {
    id: 'ceo',
    name: 'Ahmad Karimi',
    title: 'Chief Executive Officer',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'coo',
    name: 'Laila Ahmadi',
    title: 'Chief Operations Officer',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'head-logistics',
    name: 'Rahmatullah Noori',
    title: 'Head of Logistics',
    image:
      'https://images.unsplash.com/photo-1705645930353-0e335311ef20?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'head-supply',
    name: 'Farzana Wardak',
    title: 'Head of Supply Chain',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      "Galaxy Petroleum has transformed how we source fuel for our construction fleet. Their reliability and product quality are unmatched in the Afghan market.",
    author: 'Mohammad Hashimi',
    role: 'Operations Director',
    company: 'Hashimi Construction Group',
  },
  {
    id: 't2',
    quote:
      "We've been working with Galaxy for over a year. The consistency of supply — even during challenging periods — speaks to their professionalism and network strength.",
    author: 'Saba Rahimi',
    role: 'Procurement Manager',
    company: 'Kabul Industrial Enterprises',
  },
  {
    id: 't3',
    quote:
      "Their AI 92 petrol has measurably improved fleet performance. The Galaxy team is knowledgeable, responsive, and genuinely invested in our business.",
    author: 'Khalid Waziri',
    role: 'Fleet Manager',
    company: 'National Logistics Co.',
  },
]

/* ─── Journey cinematic section ──────────────────────────────── */

export const journeySourceCountries: JourneySourceCountryData[] = [
  {
    id: 'russia',
    name: 'Russia',
    flagCode: 'ru',
    tagline: 'Vast reserves. Refined at scale.',
    products: ['Diesel', 'AI-92', 'LPG'],
  },
  {
    id: 'belarus',
    name: 'Belarus',
    flagCode: 'by',
    tagline: "Eastern Europe's refining powerhouse.",
    products: ['Diesel', 'Bitumen'],
  },
  {
    id: 'azerbaijan',
    name: 'Azerbaijan',
    flagCode: 'az',
    tagline: 'Ancient oil fields on the Caspian shore.',
    products: ['Diesel', 'Jet Fuel'],
  },
  {
    id: 'iraq',
    name: 'Iraq',
    flagCode: 'iq',
    tagline: "The cradle of petroleum. Basra's black gold.",
    products: ['Diesel', 'Fuel Oil'],
  },
  {
    id: 'turkmenistan',
    name: 'Turkmenistan',
    flagCode: 'tm',
    tagline: 'Landlocked but limitless.',
    products: ['Diesel', 'LPG', 'Petrochemicals'],
  },
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    flagCode: 'uz',
    tagline: 'The gateway to the corridor north.',
    products: ['Diesel', 'AI-92'],
  },
]

export const journeyCorridorCrossings: JourneyCrossing[] = [
  {
    id: 'hairatan',
    name: 'Hairatan',
    region: 'Northern Gateway',
    tagline: 'The northern gateway. Where Uzbekistan meets Afghanistan across the Amu Darya.',
    image: 'https://images.unsplash.com/photo-1527314392553-2c7bded21b23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'islam-qala',
    name: 'Islam Qala',
    region: 'Western Entry',
    tagline: 'Ancient Silk Road crossing. Where caravans once passed, tankers now follow.',
    image: 'https://images.unsplash.com/photo-1678182451047-196f22a4143e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'tor-ghondi',
    name: 'Tor Ghondi',
    region: 'Northwestern Pass',
    tagline: 'Strategic and remote. A high-altitude corridor carved into the mountain frontier.',
    image: 'https://plus.unsplash.com/premium_photo-1675313135522-f2fac35d869a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rozanaq',
    name: 'Rozanaq',
    region: 'Northern Corridor',
    tagline: 'High-volume transit point. The artery that feeds the northern provinces.',
    image: 'https://images.unsplash.com/photo-1613690413712-dbe316605644?auto=format&fit=crop&w=1200&q=80',
  },
]

export const journeyImpactStats: JourneyImpactStat[] = [
  { value: 34,   suffix: '',  label: 'provinces reached'                    },
  { value: 3000, suffix: '+', label: 'deliveries completed'                 },
  { value: 100,  suffix: '+', label: 'team members coordinating every shipment' },
]

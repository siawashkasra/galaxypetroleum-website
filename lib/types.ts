export interface Product {
  id: string
  name: string
  grade: string
  description: string
  specs: { label: string; value: string }[]
  image: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export interface SourceCountry {
  id: string
  name: string
  flag: string
  description: string
  products: string[]
  coordinates: { x: number; y: number }
}

export interface BorderCrossing {
  id: string
  name: string
  region: string
  description: string
  coordinates: { x: number; y: number }
}

export interface JourneyRoute {
  from: string
  to: string
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  year: string
  image: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  image: string
  linkedin?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
}

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface CompanyInfo {
  name: string
  tagline: string
  founded: string
  headquarters: string
  phone: string
  whatsapp: string
  email: string
  address: string
  about: string
}

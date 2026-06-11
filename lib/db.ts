import 'server-only'
import Database from 'better-sqlite3'
import path from 'path'
import type {
  CompanyInfo,
  Product,
  Service,
  Project,
  TeamMember,
  Testimonial,
  Stat,
  JourneyImpactStat,
  CeoMessage,
} from './types'
import {
  company as seedCompany,
  stats as seedStats,
  products as seedProducts,
  services as seedServices,
  projects as seedProjects,
  team as seedTeam,
  testimonials as seedTestimonials,
  journeyImpactStats as seedJourneyStats,
  ceoMessage as seedCeoMessage,
} from './data'

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'galaxy-cms.db')

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined
}

function createDb(): Database.Database {
  const instance = new Database(DB_PATH)
  instance.pragma('journal_mode = WAL')
  instance.pragma('foreign_keys = ON')
  initSchema(instance)
  seedIfEmpty(instance)
  return instance
}

export const db: Database.Database =
  globalThis.__db ?? (globalThis.__db = createDb())

/* ─── Schema ─────────────────────────────────────────────────── */

function initSchema(instance: Database.Database) {
  instance.exec(`
    CREATE TABLE IF NOT EXISTS company_info (
      id           INTEGER PRIMARY KEY DEFAULT 1,
      name         TEXT NOT NULL,
      tagline      TEXT NOT NULL,
      founded      TEXT NOT NULL,
      headquarters TEXT NOT NULL,
      phone        TEXT NOT NULL,
      whatsapp     TEXT NOT NULL,
      email        TEXT NOT NULL,
      address      TEXT NOT NULL,
      about        TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stats (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      value      INTEGER NOT NULL,
      suffix     TEXT    NOT NULL DEFAULT '',
      label      TEXT    NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id      TEXT PRIMARY KEY,
      quote   TEXT NOT NULL,
      author  TEXT NOT NULL,
      role    TEXT NOT NULL,
      company TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      title      TEXT NOT NULL,
      image      TEXT NOT NULL,
      linkedin   TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      category    TEXT NOT NULL,
      description TEXT NOT NULL,
      year        TEXT NOT NULL,
      image       TEXT NOT NULL,
      sort_order  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS services (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      icon        TEXT NOT NULL,
      sort_order  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      grade       TEXT NOT NULL,
      description TEXT NOT NULL,
      image       TEXT NOT NULL,
      specs       TEXT NOT NULL DEFAULT '[]',
      sort_order  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS journey_impact_stats (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      value      INTEGER NOT NULL,
      suffix     TEXT    NOT NULL DEFAULT '',
      label      TEXT    NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS ceo_message (
      id      INTEGER PRIMARY KEY DEFAULT 1,
      name    TEXT NOT NULL,
      title   TEXT NOT NULL,
      photo   TEXT NOT NULL,
      message TEXT NOT NULL
    );
  `)
}

/* ─── Seed ───────────────────────────────────────────────────── */

function seedIfEmpty(instance: Database.Database) {
  // Always ensure ceo_message has a row (handles existing DBs that predate this table)
  const { ceoN } = instance.prepare('SELECT COUNT(*) as ceoN FROM ceo_message').get() as { ceoN: number }
  if (ceoN === 0) {
    instance.prepare('INSERT OR IGNORE INTO ceo_message (id,name,title,photo,message) VALUES (1,?,?,?,?)').run(
      seedCeoMessage.name, seedCeoMessage.title, seedCeoMessage.photo, seedCeoMessage.message,
    )
  }

  const { n } = instance.prepare('SELECT COUNT(*) as n FROM company_info').get() as { n: number }
  if (n > 0) return

  instance.prepare(`
    INSERT OR IGNORE INTO company_info (id,name,tagline,founded,headquarters,phone,whatsapp,email,address,about)
    VALUES (1,?,?,?,?,?,?,?,?,?)
  `).run(
    seedCompany.name, seedCompany.tagline, seedCompany.founded, seedCompany.headquarters,
    seedCompany.phone, seedCompany.whatsapp, seedCompany.email, seedCompany.address, seedCompany.about,
  )

  const insertStat = instance.prepare('INSERT INTO stats (value,suffix,label,sort_order) VALUES (?,?,?,?)')
  seedStats.forEach((s, i) => insertStat.run(s.value, s.suffix, s.label, i))

  const insertTestimonial = instance.prepare('INSERT INTO testimonials (id,quote,author,role,company) VALUES (?,?,?,?,?)')
  seedTestimonials.forEach(t => insertTestimonial.run(t.id, t.quote, t.author, t.role, t.company))

  const insertTeam = instance.prepare('INSERT INTO team_members (id,name,title,image,linkedin,sort_order) VALUES (?,?,?,?,?,?)')
  seedTeam.forEach((m, i) => insertTeam.run(m.id, m.name, m.title, m.image, m.linkedin ?? null, i))

  const insertProject = instance.prepare('INSERT INTO projects (id,title,category,description,year,image,sort_order) VALUES (?,?,?,?,?,?,?)')
  seedProjects.forEach((p, i) => insertProject.run(p.id, p.title, p.category, p.description, p.year, p.image, i))

  const insertService = instance.prepare('INSERT INTO services (id,title,description,icon,sort_order) VALUES (?,?,?,?,?)')
  seedServices.forEach((s, i) => insertService.run(s.id, s.title, s.description, s.icon, i))

  const insertProduct = instance.prepare('INSERT INTO products (id,name,grade,description,image,specs,sort_order) VALUES (?,?,?,?,?,?,?)')
  seedProducts.forEach((p, i) => insertProduct.run(p.id, p.name, p.grade, p.description, p.image, JSON.stringify(p.specs), i))

  const insertJourneyStat = instance.prepare('INSERT INTO journey_impact_stats (value,suffix,label,sort_order) VALUES (?,?,?,?)')
  seedJourneyStats.forEach((s, i) => insertJourneyStat.run(s.value, s.suffix, s.label, i))

  instance.prepare('INSERT OR IGNORE INTO ceo_message (id,name,title,photo,message) VALUES (1,?,?,?,?)').run(
    seedCeoMessage.name, seedCeoMessage.title, seedCeoMessage.photo, seedCeoMessage.message,
  )
}

/* ─── Getters ────────────────────────────────────────────────── */

export function getCompany(): CompanyInfo {
  return db.prepare('SELECT * FROM company_info WHERE id = 1').get() as CompanyInfo
}

export function getStats(): Stat[] {
  return db.prepare('SELECT * FROM stats ORDER BY sort_order').all() as Stat[]
}

export function getTestimonials(): Testimonial[] {
  return db.prepare('SELECT * FROM testimonials').all() as Testimonial[]
}

export function getTeam(): TeamMember[] {
  return db.prepare('SELECT * FROM team_members ORDER BY sort_order').all() as TeamMember[]
}

export function getProjects(): Project[] {
  return db.prepare('SELECT * FROM projects ORDER BY sort_order').all() as Project[]
}

export function getServices(): Service[] {
  return db.prepare('SELECT * FROM services ORDER BY sort_order').all() as Service[]
}

export function getProducts(): Product[] {
  return (
    db.prepare('SELECT * FROM products ORDER BY sort_order').all() as (Omit<Product, 'specs'> & { specs: string })[]
  ).map(p => ({ ...p, specs: JSON.parse(p.specs) as Product['specs'] }))
}

export function getJourneyImpactStats(): JourneyImpactStat[] {
  return db.prepare('SELECT * FROM journey_impact_stats ORDER BY sort_order').all() as JourneyImpactStat[]
}

export function getCeoMessage(): CeoMessage {
  return db.prepare('SELECT * FROM ceo_message WHERE id = 1').get() as CeoMessage
}

/* ─── Setters ────────────────────────────────────────────────── */

export function updateCompany(data: Omit<CompanyInfo, 'name'> & { name?: string }) {
  db.prepare(`
    UPDATE company_info SET
      name=?, tagline=?, founded=?, headquarters=?, phone=?, whatsapp=?, email=?, address=?, about=?
    WHERE id = 1
  `).run(
    data.name ?? seedCompany.name,
    data.tagline, data.founded, data.headquarters,
    data.phone, data.whatsapp, data.email, data.address, data.about,
  )
}

export function updateStat(id: number, data: { value: number; suffix: string; label: string }) {
  db.prepare('UPDATE stats SET value=?, suffix=?, label=? WHERE id=?').run(data.value, data.suffix, data.label, id)
}

export function upsertTestimonial(data: Testimonial) {
  db.prepare(`
    INSERT INTO testimonials (id,quote,author,role,company) VALUES (?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET quote=excluded.quote, author=excluded.author, role=excluded.role, company=excluded.company
  `).run(data.id, data.quote, data.author, data.role, data.company)
}

export function deleteTestimonial(id: string) {
  db.prepare('DELETE FROM testimonials WHERE id=?').run(id)
}

export function upsertTeamMember(data: TeamMember & { sort_order?: number }) {
  const order = data.sort_order ?? (db.prepare('SELECT COUNT(*) as n FROM team_members').get() as { n: number }).n
  db.prepare(`
    INSERT INTO team_members (id,name,title,image,linkedin,sort_order) VALUES (?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name, title=excluded.title, image=excluded.image, linkedin=excluded.linkedin
  `).run(data.id, data.name, data.title, data.image, data.linkedin ?? null, order)
}

export function deleteTeamMember(id: string) {
  db.prepare('DELETE FROM team_members WHERE id=?').run(id)
}

export function upsertProject(data: Project & { sort_order?: number }) {
  const order = data.sort_order ?? (db.prepare('SELECT COUNT(*) as n FROM projects').get() as { n: number }).n
  db.prepare(`
    INSERT INTO projects (id,title,category,description,year,image,sort_order) VALUES (?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET title=excluded.title, category=excluded.category, description=excluded.description, year=excluded.year, image=excluded.image
  `).run(data.id, data.title, data.category, data.description, data.year, data.image, order)
}

export function deleteProject(id: string) {
  db.prepare('DELETE FROM projects WHERE id=?').run(id)
}

export function updateService(data: Pick<Service, 'id' | 'title' | 'description'>) {
  db.prepare('UPDATE services SET title=?, description=? WHERE id=?').run(data.title, data.description, data.id)
}

export function updateProduct(data: Omit<Product, 'specs'> & { specs: Product['specs'] }) {
  db.prepare('UPDATE products SET name=?, grade=?, description=?, image=?, specs=? WHERE id=?').run(
    data.name, data.grade, data.description, data.image, JSON.stringify(data.specs), data.id,
  )
}

export function updateJourneyImpactStat(id: number, data: { value: number; suffix: string; label: string }) {
  db.prepare('UPDATE journey_impact_stats SET value=?, suffix=?, label=? WHERE id=?').run(data.value, data.suffix, data.label, id)
}

export function updateCeoMessage(data: CeoMessage) {
  db.prepare('UPDATE ceo_message SET name=?, title=?, photo=?, message=? WHERE id=1').run(
    data.name, data.title, data.photo, data.message,
  )
}

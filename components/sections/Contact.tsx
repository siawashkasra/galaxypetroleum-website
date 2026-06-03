'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react'
import { company } from '@/lib/data'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const WA_NUMBER  = company.whatsapp.replace(/\D/g, '')
const WA_MESSAGE = encodeURIComponent(
  "Hello, I'd like to inquire about Galaxy Petroleum's fuel products and services.",
)

/* ─── Schema ─────────────────────────────────────────────────── */

const schema = z.object({
  name:    z.string().min(2, 'Full name is required'),
  company: z.string().optional(),
  email:   z.string().email('A valid email address is required'),
  phone:   z.string().optional(),
  product: z.string().min(1, 'Please select a product of interest'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormValues = z.infer<typeof schema>

const PRODUCTS = ['Petrol AI 92', 'Petrol AI 95', 'Diesel', 'LPG', 'Multiple products', 'General inquiry']

/* ─── Field wrapper ──────────────────────────────────────────── */

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-rose-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full border border-border bg-background px-4 py-3 text-[14px] text-ink placeholder:text-muted/40 outline-none transition-colors duration-200 focus:border-gold'

/* ─── Contact form ───────────────────────────────────────────── */

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (_data: FormValues) => {
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center gap-5 px-8 py-20 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <CheckCircle size={44} strokeWidth={1.2} className="text-gold" />
        <div>
          <p
            className="text-ink"
            style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: '1.8rem', letterSpacing: '0.04em' }}
          >
            Message Received
          </p>
          <p className="mt-2 text-[14px] leading-7 text-muted">
            Thank you for reaching out. Our team will be in touch within 24 hours.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold underline underline-offset-4"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 p-8 lg:p-10">
      {/* Name + Company */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name *" error={errors.name?.message}>
          <input
            {...register('name')}
            placeholder="Ahmad Karimi"
            className={inputClass}
            autoComplete="name"
          />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <input
            {...register('company')}
            placeholder="Your company"
            className={inputClass}
            autoComplete="organization"
          />
        </Field>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Email Address *" error={errors.email?.message}>
          <input
            {...register('email')}
            type="email"
            placeholder="you@company.com"
            className={inputClass}
            autoComplete="email"
          />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message}>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+93 XXX XXX XXXX"
            className={inputClass}
            autoComplete="tel"
          />
        </Field>
      </div>

      {/* Product interest */}
      <Field label="Product of Interest *" error={errors.product?.message}>
        <select {...register('product')} className={`${inputClass} cursor-pointer`}>
          <option value="">Select a product…</option>
          {PRODUCTS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </Field>

      {/* Message */}
      <Field label="Message *" error={errors.message?.message}>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Tell us about your fuel requirements, volumes, delivery locations, or any other details…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2.5 bg-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-gold-dark disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <motion.span
              className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            />
            Sending…
          </>
        ) : (
          <>
            <Send size={14} strokeWidth={2} />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

const CONTACT_ITEMS = [
  { icon: Mail,    label: 'Email',    value: company.email        },
  { icon: Phone,   label: 'Phone',    value: company.phone        },
  { icon: MapPin,  label: 'Address',  value: company.headquarters },
]

export default function Contact() {
  return (
    <section id="contact" aria-label="Contact Galaxy Petroleum" className="bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[40%_60%]">

          {/* ── Left: info ───────────────────────────────────── */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
              Get in Touch
            </p>
            <h2
              className="text-ink"
              style={{
                fontFamily: 'var(--font-bebas-neue)',
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                letterSpacing: '0.02em',
                lineHeight: 0.95,
              }}
            >
              Let&rsquo;s Talk
              <br />
              <span style={{ color: 'var(--color-gold)' }}>Energy</span>
            </h2>

            <p className="mt-6 max-w-sm text-[14px] leading-7 text-muted">
              Whether you need a quote, have a logistics question, or want to
              discuss a long-term supply partnership — our team responds within
              24 hours.
            </p>

            {/* Contact details */}
            <ul className="mt-10 space-y-5">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center border border-gold/25 text-gold">
                    <Icon size={15} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
                      {label}
                    </p>
                    <p className="mt-0.5 text-[14px] text-ink">{value}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 self-start px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              {/* WhatsApp icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* ── Right: form ──────────────────────────────────── */}
          <motion.div
            className="border border-border bg-background"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

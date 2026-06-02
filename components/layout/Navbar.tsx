'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { company } from '@/lib/data'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'The Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Network', href: '#network' },
  { label: 'Contact', href: '#contact' },
]

const SCROLL_THRESHOLD = 80

export default function Navbar() {
  const [isScrolled, setIsScrolled]   = useState(false)
  const [isVisible, setIsVisible]     = useState(true)
  const [isMenuOpen, setIsMenuOpen]   = useState(false)
  const prefersReducedMotion          = useReducedMotion()
  const lastScrollY                   = useRef(0)

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY
    const delta    = currentY - lastScrollY.current

    setIsScrolled(currentY > SCROLL_THRESHOLD)

    if (currentY < SCROLL_THRESHOLD) {
      setIsVisible(true)
    } else if (delta > 6) {
      // Scrolling down — hide
      setIsVisible(false)
      setIsMenuOpen(false) // close mobile menu if open
    } else if (delta < -4) {
      // Scrolling up — reveal
      setIsVisible(true)
    }

    lastScrollY.current = currentY
  }, [])

  useEffect(() => {
    lastScrollY.current = window.scrollY
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const isLight = isScrolled || isMenuOpen

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          isLight
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
        animate={{ y: isVisible ? '0%' : '-100%' }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10 lg:py-5"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Galaxy Petroleum — Home"
          >
            <Image
              src="/logo.png"
              alt="Galaxy Petroleum"
              width={180}
              height={64}
              priority
              className="h-14 w-auto object-contain transition-all duration-500"
              style={{
                filter: isLight
                  ? 'none'
                  : 'brightness(0) invert(1)',
              }}
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`group relative text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    isLight
                      ? 'text-muted hover:text-ink'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            href="#contact"
            className={`hidden lg:inline-flex items-center px-6 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
              isLight
                ? 'border border-gold text-gold hover:bg-gold hover:text-white'
                : 'border border-white/50 text-white hover:border-white hover:bg-white/10'
            }`}
          >
            Get a Quote
          </Link>

          {/* Mobile toggle */}
          <button
            className={`flex h-10 w-10 items-center justify-center transition-colors duration-300 lg:hidden ${
              isLight ? 'text-ink' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span
                  key="close"
                  initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <X size={22} strokeWidth={1.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={prefersReducedMotion ? false : { rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Menu size={22} strokeWidth={1.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            key="mobile-menu"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-background px-6 pb-10 pt-24 lg:hidden"
          >
            <ul className="flex flex-col" role="list">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.li
                  key={href}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : 0.04 * i,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className="group flex items-center justify-between border-b border-border py-5 text-4xl text-ink transition-colors duration-200 hover:text-gold"
                    style={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.05em' }}
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className="text-xl text-border transition-colors duration-200 group-hover:text-gold"
                    >
                      →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto space-y-4 pt-8">
              <Link
                href="#contact"
                onClick={closeMenu}
                className="flex w-full items-center justify-center bg-gold py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white transition-colors duration-200 hover:bg-gold-dark"
              >
                Get a Quote
              </Link>
              <p className="text-center text-xs text-muted">{company.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

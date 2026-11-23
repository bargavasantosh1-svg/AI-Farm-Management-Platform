import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

// Navigation links used in both desktop and mobile menus
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Support", href: "/#support" },
]

export default function Navbar() {
  // Controls whether the mobile menu panel is open
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Currently selected language (simple local UI state, no backend)
  const [language, setLanguage] = useState("English")

  // Respect users who prefer reduced motion
  const shouldReduceMotion = useReducedMotion()

  // Closes the mobile menu (used when a link is clicked)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <motion.header
      // Subtle entrance animation for the whole navbar
      initial={shouldReduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-[#DCFCE7] bg-[#F6FBF7]/90 backdrop-blur"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* LEFT: Logo */}
        <a href="/" className="flex items-center gap-2">
          {/* Small green circular leaf icon */}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6" />
            </svg>
          </span>
          <span className="text-xl font-bold text-[#14532D]">AI Farm</span>
        </a>

        {/* CENTER: Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-medium text-[#14532D] transition-colors hover:text-[#16A34A]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* RIGHT: Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select language"
            className="rounded-lg border border-[#DCFCE7] bg-white px-3 py-2 text-sm font-medium text-[#14532D] shadow-sm outline-none focus:border-[#16A34A]"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>

          {/* Login button */}
          <motion.a
            href="/login"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            className="rounded-lg border border-[#16A34A] px-4 py-2 text-sm font-semibold text-[#16A34A] transition-colors hover:bg-[#DCFCE7]"
          >
            Login
          </motion.a>

          {/* Get Started button */}
          <motion.a
            href="/login"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#14532D]"
          >
            Get Started
          </motion.a>
        </div>

        {/* MOBILE: Hamburger button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#14532D] hover:bg-[#DCFCE7] md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* MOBILE: Animated navigation panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[#DCFCE7] bg-white md:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              {/* Navigation links */}
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2 text-base font-medium text-[#14532D] hover:bg-[#DCFCE7]"
                >
                  {link.label}
                </a>
              ))}

              {/* Language selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select language"
                className="mt-2 rounded-lg border border-[#DCFCE7] bg-white px-3 py-2 text-sm font-medium text-[#14532D] shadow-sm outline-none focus:border-[#16A34A]"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>

              {/* Login button */}
              <a
                href="/login"
                onClick={closeMenu}
                className="mt-2 rounded-lg border border-[#16A34A] px-4 py-2 text-center text-sm font-semibold text-[#16A34A] hover:bg-[#DCFCE7]"
              >
                Login
              </a>

              {/* Get Started button */}
              <a
                href="/login"
                onClick={closeMenu}
                className="rounded-lg bg-[#16A34A] px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#14532D]"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
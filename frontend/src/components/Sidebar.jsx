import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Sprout,
  Bug,
  CloudSun,
  LineChart,
  TrendingUp,
  FlaskConical,
  Mountain,
  PiggyBank,
  FileText,
  LifeBuoy,
  Leaf,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react"

// Menu items for the farmer dashboard sidebar
const menuItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Crop Recommendation", href: "/farmer/crop", icon: Sprout },
  { label: "Plant Disease Detection", href: "/farmer/disease", icon: Bug },
  { label: "Weather Advisory", href: "/farmer/weather", icon: CloudSun },
  { label: "Yield Prediction", href: "/farmer/yield", icon: LineChart },
  { label: "Market Price Prediction", href: "/farmer/market", icon: TrendingUp },
  { label: "Fertilizer Recommendation", href: "/farmer/fertilizer", icon: FlaskConical },
  { label: "Soil Health", href: "/farmer/soil", icon: Mountain },
  { label: "Profit Prediction", href: "/farmer/profit", icon: PiggyBank },
  { label: "Reports", href: "/farmer/reports", icon: FileText },
  { label: "Support", href: "/farmer/support", icon: LifeBuoy },
]

export default function Sidebar() {
  // Collapsed state for desktop, open state for mobile drawer
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Determine the current page (works without React Router)
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/farmer/dashboard"

  const isActive = (href) => currentPath === href

  // The actual navigation content, reused for desktop and mobile
  const NavContent = ({ showLabels }) => (
    <div className="flex h-full flex-col">
      {/* Logo / Title */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#DCFCE7]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16A34A] text-white shadow-sm">
          <Leaf className="h-6 w-6" />
        </div>
        {showLabels && (
          <div className="leading-tight">
            <p className="text-lg font-bold text-[#14532D]">AI Farm</p>
            <p className="text-xs font-medium text-[#16A34A]">Smart Farming</p>
          </div>
        )}
      </div>

      {/* Menu items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  title={!showLabels ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[#16A34A] text-white shadow-sm"
                      : "text-[#14532D] hover:bg-[#DCFCE7] hover:translate-x-0.5"
                  } ${!showLabels ? "justify-center" : ""}`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-white" : "text-[#16A34A]"
                    }`}
                  />
                  {showLabels && <span className="truncate">{item.label}</span>}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer note */}
      {showLabels && (
        <div className="border-t border-[#DCFCE7] px-4 py-4">
          <p className="text-xs text-[#14532D]/70">{"\u00A9"} 2026 AI Farm Platform</p>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile top bar with toggle */}
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16A34A] text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-[#14532D]">AI Farm</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-[#14532D] transition-colors hover:bg-[#DCFCE7]"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 264 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="sticky top-0 hidden h-screen shrink-0 bg-white shadow-md md:block"
      >
        <div className="relative h-full">
          <NavContent showLabels={!collapsed} />

          {/* Collapse / expand toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3 top-20 flex h-7 w-7 items-center justify-center rounded-full border border-[#DCFCE7] bg-white text-[#16A34A] shadow-md transition-colors hover:bg-[#DCFCE7]"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-[#14532D]/40 md:hidden"
            />
            {/* Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 rounded-lg p-2 text-[#14532D] transition-colors hover:bg-[#DCFCE7]"
              >
                <X className="h-5 w-5" />
              </button>
              <NavContent showLabels={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
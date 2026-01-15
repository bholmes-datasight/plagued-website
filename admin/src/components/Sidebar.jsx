import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  BarChart3,
} from 'lucide-react'

const navItems = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    to: '/orders',
    icon: ShoppingBag,
    label: 'Orders',
  },
  {
    to: '/products',
    icon: Package,
    label: 'Products & Stock',
  },
  {
    to: '/collections',
    icon: Layers,
    label: 'Collections',
  },
  {
    to: '/customers',
    icon: Users,
    label: 'Customers',
  },
  {
    to: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
  },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-plague-grey border-r border-plague-lighter flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-plague-lighter">
        <img
          src="/logo-green.png"
          alt="Plagued"
          className="h-16 mx-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-display uppercase tracking-wider text-sm transition-all ${
                  isActive
                    ? 'bg-plague-green text-plague-black'
                    : 'text-plague-mist hover:bg-plague-lighter hover:text-plague-green'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-plague-lighter text-center">
        <p className="text-plague-mist/40 text-xs uppercase tracking-wider">
          Admin Dashboard v1.0
        </p>
      </div>
    </aside>
  )
}

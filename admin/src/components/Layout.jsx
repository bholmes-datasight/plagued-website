import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { LogOut, User } from 'lucide-react'

export default function Layout() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-plague-black flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-plague-grey border-b border-plague-lighter px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl uppercase tracking-wider text-plague-green">
              Admin
            </h1>

            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-2 text-plague-mist">
                <User className="w-5 h-5" />
                <span className="text-sm">{user?.email}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-plague-mist hover:text-plague-red-bright transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

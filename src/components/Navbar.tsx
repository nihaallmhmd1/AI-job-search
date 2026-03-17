'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Briefcase, Search, Upload, Bookmark, Bell, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/auth/actions'
import { NotificationCenter } from './NotificationCenter'

const navItems = [
  { name: 'Browse', href: '/dashboard', icon: Search },
  { name: 'Preferences', href: '/preferences', icon: User },
  { name: 'Upload', href: '/resume', icon: Upload },
  { name: 'Saved', href: '/saved', icon: Bookmark },
]

export function Navbar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center group-hover:rotate-3 transition-transform">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">AI Job Search</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                pathname === item.href 
                  ? "bg-gray-50 text-gray-900" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-3 h-3 text-gray-500" />
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-gray-900 leading-none truncate max-w-[80px]">
              {user?.user_metadata?.full_name || 'User'}
            </p>
          </div>
        </div>
        
        <NotificationCenter />

        <button 
          onClick={() => signOut()}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}

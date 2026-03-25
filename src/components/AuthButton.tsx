'use client'

import { createClient } from '@/lib/supabase/client'
import { LogIn, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AuthButtonProps {
  user?: any
  label?: string
  className?: string
}

export function AuthButton({ user, label = "Sign in with Google", className }: AuthButtonProps) {
  const supabase = createClient()
  const router = useRouter()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <button
        onClick={handleSignOut}
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
          className
        )}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className={cn(
        "flex items-center justify-center gap-3 px-8 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all text-base font-semibold text-gray-700 active:scale-95",
        className
      )}
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
      {label}
    </button>
  )
}

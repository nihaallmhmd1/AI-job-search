'use client'

import { useState } from 'react'
import { signInWithGoogle, signInWithEmail } from '@/app/auth/actions'
import { Briefcase, Chrome, Mail, ArrowRight, Zap } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      await signInWithEmail(email)
      setIsEmailSent(true)
      toast.success('Check your email for the login link!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send login link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center px-6 py-12">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">AI Job Search</span>
      </div>

      <div className="w-full max-w-sm bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100/50 p-10">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-xs text-gray-400 font-medium">Login to access your job search dashboard.</p>
        </div>

        {!isEmailSent ? (
          <div className="space-y-6">
            <button 
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-gray-700 shadow-sm active:scale-95"
            >
              <Chrome className="w-5 h-5 text-blue-500" />
              <span className="text-xs uppercase tracking-tight">Sign in with Google</span>
            </button>

            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-50"></div>
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-gray-50"></div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-gray-900 transition-all outline-none"
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gray-900 text-white text-xs font-bold rounded-2xl hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
              >
                {isLoading ? (
                  <Zap className="w-4 h-4 animate-pulse" />
                ) : (
                  <>
                    <span className="uppercase tracking-widest">Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your inbox</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-8">
              We've sent a magic link to <span className="text-gray-900 font-bold">{email}</span>. Click it to login instantly.
            </p>
            <button 
              onClick={() => setIsEmailSent(false)}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        © 2026 AI Job Search. All rights reserved.
      </p>
    </div>
  )
}

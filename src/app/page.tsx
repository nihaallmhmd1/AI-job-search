'use client'

import { useState } from 'react'
import { signInWithGoogle, signInWithEmail } from '@/app/auth/actions'
import { Briefcase, Chrome, Mail, ArrowRight, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function LandingPage() {
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
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-blue-100 flex flex-col">
      {/* Header */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">AI Job Search</span>
        </div>
      </nav>

      {/* Hero & Login Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Value Prop */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Powered by Gemini & Firecrawl</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 leading-[1.1] tracking-tightest">
              Hire intelligence for your <span className="text-gray-400">career search.</span>
            </h1>
            
            <p className="text-gray-500 text-lg sm:text-xl font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Scrape thousands of live jobs and match them against your resume with AI precision. Fast, minimal, and smarter than LinkedIn.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-900">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight">Zero Lag</span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">Blazing fast search and dashboard transitions.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-900">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight">Private</span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">Your resume data is yours. Secured by RLS.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Auth Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100/50 p-10">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Get Started</h2>
                <p className="text-xs text-gray-400 font-medium">Login or create an account to start your search.</p>
              </div>

              {!isEmailSent ? (
                <div className="space-y-6">
                  {/* Google Login */}
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

                  {/* Email Login */}
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
                          <span className="uppercase tracking-widest">Login / Signup</span>
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

              <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
                  Join 1,000+ humans finding jobs with AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2026 AI Job Search. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Globe className="w-4 h-4 text-gray-300" />
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Built for the future of work.</p>
        </div>
      </footer>
    </div>
  )
}

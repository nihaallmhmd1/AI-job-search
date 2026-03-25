import { Briefcase, ArrowRight, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
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

      {/* Hero & Entry Section */}
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
                <p className="text-[11px] text-gray-400 font-medium">Your resume data remains local to this instance.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Entry Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100/50 p-10 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
              <p className="text-xs text-gray-400 font-medium mb-8 leading-relaxed">Dive right into finding your next role. No account required.</p>
              
              <Link
                href="/login"
                className="w-full py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 mb-8"
              >
                Create Your Profile
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-8 border-t border-gray-50 text-center">
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

'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, BrainCircuit } from 'lucide-react'
import { processResumeFile } from '@/app/actions/ai'
import { getUserPreferences, saveUserPreferences } from '@/app/actions/preferences'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { Save } from 'lucide-react'

export default function ResumeUploadUI({ user }: { user: any }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await processResumeFile(formData)
      setAnalysis(result)
      toast.success('Resume analyzed successfully!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    if (!analysis) return
    setIsSyncing(true)

    try {
      const currentPrefs = await getUserPreferences()
      
      const updatedPrefs = {
        ...currentPrefs,
        job_functions: Array.from(new Set([...(currentPrefs?.job_functions || []), ...(analysis.roles || [])])),
        skills: Array.from(new Set([...(currentPrefs?.skills || []), ...(analysis.skills || [])])),
        location: analysis.location !== 'Not Specified' ? analysis.location : currentPrefs?.location,
        experience_level: analysis.experience !== 'Fresher' ? analysis.experience : currentPrefs?.experience_level || 'Fresher'
      }

      await saveUserPreferences(updatedPrefs)
      toast.success('Preferences updated with resume data!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error('Failed to sync preferences')
      console.error(error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar user={user} />
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Resume Intelligence</h1>
          <p className="text-gray-500 text-sm">Upload your resume and let AI match you with the perfect role.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload Section */}
          <section>
            <form onSubmit={handleUpload} className="space-y-6">
              <div 
                className={cn(
                  "relative border-2 border-dashed rounded-[32px] p-12 transition-all group flex flex-col items-center justify-center gap-4 text-center bg-white",
                  file ? "border-blue-200 bg-blue-50/20" : "border-gray-100 hover:border-gray-200"
                )}
              >
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                  file ? "bg-blue-500 text-white shadow-lg shadow-blue-100" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                )}>
                  {file ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                </div>

                <div>
                  <p className="text-[13px] font-bold text-gray-900 mb-1">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    PDF, DOCX, or TXT up to 5MB
                  </p>
                </div>
              </div>

              <button 
                disabled={!file || isLoading}
                className="w-full py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                {isLoading ? 'Analyzing with AI...' : 'Analyze My Resume'}
              </button>
            </form>

            <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight">AI Matching Insights</h3>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed italic">
                 "Our AI extracts your core technologies and matches them against thousands of live scraping results to find entries with the highest correlation to your experience level."
               </p>
            </div>
          </section>

          {/* Analysis View */}
          <section>
            {analysis ? (
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm h-full animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8 pb-8 border-b border-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-blue-50 text-blue-600">Analysis Complete</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                <div className="mb-8 flex justify-center">
                  <button 
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-xs font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50"
                  >
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {isSyncing ? 'Updating Preferences...' : 'Update My Preferences'}
                  </button>
                </div>

                <div className="space-y-8">
                  {analysis.location && (
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Location Extracted</h4>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-900 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                         {analysis.location}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Core Skills Extracted</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills?.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Suggested Career Paths</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.roles?.map((role: string) => (
                        <span key={role} className="px-3 py-1 bg-blue-50/50 border border-blue-100 rounded-lg text-[11px] font-bold text-blue-700">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {analysis.experience && (
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Work Experience Extracted</h4>
                      <div className="px-4 py-3 bg-blue-50/30 border border-blue-100/50 rounded-2xl text-[13px] font-bold text-blue-900 flex items-center gap-2">
                         <Sparkles className="w-4 h-4 text-blue-500" />
                         {analysis.experience}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Strengths</h4>
                      <ul className="space-y-2">
                        {analysis.strengths?.map((str: string) => (
                          <li key={str} className="flex items-start gap-2 text-[11px] text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                            {str}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Improvement Gaps</h4>
                      <ul className="space-y-2">
                        {analysis.gaps?.map((gap: string) => (
                          <li key={gap} className="flex items-start gap-2 text-[11px] text-gray-600">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[32px] p-12 flex flex-col items-center justify-center text-center h-full">
                <BrainCircuit className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-tight text-xs">Awaiting Analysis</p>
                <p className="text-gray-400 text-[10px] mt-2 px-10">
                  Upload your resume to see extracted skills, strengths, and smart role recommendations.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

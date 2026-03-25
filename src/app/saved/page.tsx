import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { JobCard } from '@/components/JobCard'
import { Bookmark, Search } from 'lucide-react'

export default async function SavedJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: savedJobs } = await supabase
    .from('saved_jobs')
    .select(`
      id,
      status,
      jobs (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-3">
             <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200">
               <Bookmark className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-4xl font-black text-gray-900 tracking-tightest">Your Saved Jobs</h1>
          </div>
          <p className="text-gray-500 text-sm font-medium">Track your interest and application status for your favorite roles.</p>
        </header>

        {savedJobs && savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((item: any) => (
              <JobCard 
                key={item.id} 
                job={item.jobs} 
                isSaved={true}
                isApplied={item.status === 'applied'}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-gray-50/50 rounded-[48px] border-2 border-dashed border-gray-100">
            <Bookmark className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No saved jobs found</p>
            <p className="text-gray-400 text-[10px] mt-2 mb-8 uppercase px-10">Bookmark jobs from the dashboard to keep track of your career progress.</p>
            <a href="/dashboard" className="w-fit mx-auto px-6 py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all">Browse Jobs</a>
          </div>
        )}
      </main>
    </div>
  )
}

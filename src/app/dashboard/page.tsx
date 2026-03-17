import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { DashboardContent } from '@/components/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch initial jobs from DB
  const { data: initialJobs } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tightest mb-3">Find your next role</h1>
          <p className="text-gray-500 text-sm font-medium">Discover opportunities tailored to your unique skills and career path.</p>
        </header>

        <DashboardContent initialJobs={initialJobs || []} />
      </main>
    </div>
  )
}

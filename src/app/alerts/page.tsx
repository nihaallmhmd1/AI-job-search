import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Bell, ShieldCheck, Mail, PlusCircle } from 'lucide-react'

export default async function AlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: alerts } = await supabase
    .from('job_alerts')
    .select('*')
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar user={user} />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-3">
               <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200">
                 <Bell className="w-6 h-6 text-white" />
               </div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tightest">Job Alerts</h1>
            </div>
            <p className="text-gray-500 text-sm font-medium">Get notified the moment a perfect role is found by our AI scraper.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-900 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all uppercase tracking-widest">
            <PlusCircle className="w-4 h-4" />
            New Alert
          </button>
        </header>

        <section className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm">
             <div className="max-w-md">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Scraper Enabled</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-8">
                  Your current alerts are processed every 24 hours. When a match is found with &gt;80% relevance to your resume, we&apos;ll pin it to your dashboard.
                </p>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <Mail className="w-4 h-4 text-gray-400" />
                   <span className="text-[11px] font-bold text-gray-700">{user.email}</span>
                   <span className="ml-auto badge bg-white border border-gray-200 text-gray-400">Verified</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {alerts && alerts.length > 0 ? (
               alerts.map((alert: any) => (
                 <div key={alert.id} className="minimal-card p-6">
                    <div className="flex justify-between items-start mb-4">
                       <h4 className="text-sm font-bold text-gray-900">{alert.keywords?.join(', ') || 'General Search'}</h4>
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-6">{alert.location || 'Anywhere'}</p>
                    <button className="w-full py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase rounded-lg border border-transparent hover:border-gray-100 transition-all">
                       Pause Alert
                    </button>
                 </div>
               ))
             ) : (
               <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No custom alerts configured yet</p>
               </div>
             )}
          </div>
        </section>
      </main>
    </div>
  )
}

'use client'

import { MapPin, Building2, ExternalLink, Bookmark, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'
import { toggleSaveJob } from '@/app/actions/jobs'
import { updateApplicationStatus } from '@/app/actions/tracking'
import { toast } from 'react-hot-toast'

interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary?: string
  description: string
  apply_link: string
  source: string
  created_at: string
}

export function JobCard({ 
  job, 
  isSaved: initialIsSaved, 
  isApplied 
}: { 
  job: Job, 
  isSaved?: boolean, 
  isApplied?: boolean
}) {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isSaving, setIsSaving] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggleSave = async () => {
    setIsSaving(true)
    try {
      await toggleSaveJob(job.id)
      setIsSaved(!isSaved)
      toast.success(isSaved ? 'Removed from saved' : 'Job saved!')
    } catch (error) {
      toast.error('Failed to save job')
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (status: 'Applied' | 'Interested' | 'Rejected') => {
    try {
      await updateApplicationStatus(job.id, status)
      setCurrentStatus(status)
      toast.success(`Marked as ${status}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="minimal-card p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">{job.title}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">{job.company}</span>
          </div>
        </div>
        <button 
          onClick={handleToggleSave}
          disabled={isSaving}
          className={cn(
            "p-2 rounded-xl border transition-all disabled:opacity-50",
            isSaved 
              ? "bg-blue-50 border-blue-100 text-blue-600 shadow-sm" 
              : "bg-white border-gray-100 text-gray-400 hover:text-gray-900 border-gray-200"
          )}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/50 border border-blue-50 rounded-lg">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{job.job_type}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50/50 border border-green-50 rounded-lg">
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">{job.salary}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
        {job.description || "No description provided. Click apply to view details on the source website."}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {mounted 
              ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true })
              : 'Recently'}
          </span>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {(!isApplied && !currentStatus) ? (
            <div className="flex gap-2">
              <select 
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="px-2 py-2 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-xl border-none outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Set Status</option>
                <option value="Interested">Interested</option>
                <option value="Applied">Applied</option>
                <option value="Rejected">Rejected</option>
              </select>
              <a 
                href={job.apply_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[11px] font-bold rounded-xl hover:bg-gray-800 transition-all"
              >
                Apply
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               <select 
                value={currentStatus || ""}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className={cn(
                  "px-3 py-2 text-[10px] font-bold uppercase rounded-xl border-none outline-none focus:ring-2 appearance-none text-center cursor-pointer",
                  currentStatus === 'Applied' && "bg-green-50 text-green-700",
                  currentStatus === 'Interested' && "bg-blue-50 text-blue-700",
                  currentStatus === 'Rejected' && "bg-red-50 text-red-700",
                )}
              >
                <option value="Interested">Interested</option>
                <option value="Applied">Applied</option>
                <option value="Rejected">Rejected</option>
              </select>
               <a 
                href={job.apply_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

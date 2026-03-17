'use client'

import { Suspense, useEffect } from 'react'
import { Search, MapPin, Briefcase, Sparkles, Loader2, RefreshCcw, X } from 'lucide-react'
import { JobCard } from '@/components/JobCard'
import { getJobRecommendations } from '@/app/actions/ai'
import { getUserPreferences } from '@/app/actions/preferences'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useJobSearch } from '@/hooks/useJobSearch'

// ------- Sub-components -------

function JobSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
          <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded-xl" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-100 rounded-lg w-20" />
        <div className="h-6 bg-gray-100 rounded-lg w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 bg-gray-100 rounded w-16" />
        <div className="h-8 bg-gray-100 rounded-xl w-20" />
      </div>
    </div>
  )
}

const FILTER_OPTIONS = [
  { key: 'internship' as const, label: 'Internship' },
  { key: 'entryLevel' as const, label: 'Entry Level' },
  { key: 'remote' as const, label: 'Remote' },
  { key: 'fullTime' as const, label: 'Full-time' },
]

// ------- Main Component -------

function DashboardInner({ initialJobs }: { initialJobs: any[] }) {
  const {
    filters, setFilter, toggleFilter, search,
    jobs, setJobs, isLoading, page, totalPages, setPage
  } = useJobSearch(initialJobs)

  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isRecLoading, setIsRecLoading] = useState(false)

  // Load AI recommendations + preference-based auto-search
  useEffect(() => {
    loadRecommendations()
    autoSearchFromPreferences()
  }, [])

  const autoSearchFromPreferences = async () => {
    // Only auto-search if no filters in URL already
    if (filters.query || filters.location || filters.remote || filters.fullTime) return
    try {
      const prefs = await getUserPreferences()
      if (prefs) {
        const parts: string[] = []
        if (prefs.job_functions?.length > 0) parts.push(prefs.job_functions[0])
        const q = parts.join(' ').trim()
        const loc = prefs.location || ''
        if (q || loc) {
          setFilter('query', q)
          if (loc) setFilter('location', loc)
        }
      }
    } catch { /* silent */ }
  }

  const loadRecommendations = async () => {
    setIsRecLoading(true)
    try {
      const recs = await getJobRecommendations()
      setRecommendations(recs)
    } catch {
      console.error('Failed to load recommendations')
    } finally {
      setIsRecLoading(false)
    }
  }

  const activeFilterCount = [filters.remote, filters.fullTime, filters.internship, filters.entryLevel].filter(Boolean).length

  return (
    <div className="space-y-12">
      {/* ── Search + Filters ── */}
      <section className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Keyword */}
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            <input
              type="text"
              value={filters.query}
              onChange={e => setFilter('query', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Job title, skills, or company..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
            />
          </div>

          {/* Location */}
          <div className="w-full lg:w-56 relative group">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            <input
              type="text"
              value={filters.location}
              onChange={e => setFilter('location', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Location"
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={search}
            disabled={isLoading}
            className="w-full lg:w-auto px-10 py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filter Chips */}
        <div className="mt-6 pt-6 border-t border-gray-50 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">Filters</span>
          {FILTER_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={cn(
                'px-5 py-2.5 text-[11px] font-bold rounded-[14px] border transition-all flex items-center gap-2',
                filters[key]
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              {filters[key] && <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />}
              {label}
            </button>
          ))}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                ((['remote', 'fullTime', 'internship', 'entryLevel'] as const)).forEach(k => {
                  if (filters[k]) toggleFilter(k)
                })
              }}
              className="ml-auto text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear {activeFilterCount}
            </button>
          )}
        </div>
      </section>

      {/* ── AI Recommendations ── */}
      {(recommendations.length > 0 || isRecLoading) && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">AI Recommended For You</h2>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-0.5">Matched from your resume and preferences</p>
              </div>
            </div>
            <button
              onClick={loadRecommendations}
              disabled={isRecLoading}
              className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
            >
              <RefreshCcw className={cn('w-4 h-4', isRecLoading && 'animate-spin')} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isRecLoading
              ? Array.from({ length: 3 }).map((_, i) => <JobSkeleton key={i} />)
              : recommendations.map(job => <JobCard key={job.id} job={job} />)
            }
          </div>
        </section>
      )}

      {/* ── Recent Job Listings ── */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {filters.query || activeFilterCount > 0 ? 'Search Results' : 'Recent Job Listings'}
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                {isLoading ? 'Searching...' : `${jobs.length} listing${jobs.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <JobSkeleton key={i} />)}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="px-5 py-2.5 text-[11px] font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-gray-500">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-5 py-2.5 text-[11px] font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center bg-gray-50/50 rounded-[48px] border-2 border-dashed border-gray-100">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No jobs found</p>
            <p className="text-gray-400 text-[10px] mt-2 mb-8 uppercase">
              {filters.query ? `No results for "${filters.query}"` : 'Start by searching above or setting your preferences'}
            </p>
            <button
              onClick={search}
              className="mx-auto px-6 py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all"
            >
              Retry Search
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

// Wrap in Suspense so useSearchParams works in Next.js App Router
export function DashboardContent({ initialJobs }: { initialJobs: any[] }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>}>
      <DashboardInner initialJobs={initialJobs} />
    </Suspense>
  )
}

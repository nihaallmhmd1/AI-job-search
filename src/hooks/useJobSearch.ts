'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface JobFilters {
  query: string
  location: string
  remote: boolean
  fullTime: boolean
  internship: boolean
  entryLevel: boolean
}

const DEFAULT_FILTERS: JobFilters = {
  query: '',
  location: '',
  remote: false,
  fullTime: false,
  internship: false,
  entryLevel: false
}

export function useJobSearch(initialJobs: any[] = []) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialise from URL params
  const [filters, setFilters] = useState<JobFilters>({
    query: searchParams.get('query') || '',
    location: searchParams.get('location') || '',
    remote: searchParams.get('remote') === 'true',
    fullTime: searchParams.get('fullTime') === 'true',
    internship: searchParams.get('internship') === 'true',
    entryLevel: searchParams.get('entryLevel') === 'true'
  })

  const [jobs, setJobs] = useState<any[]>(initialJobs)
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const isFirstRender = useRef(true)

  const buildParams = useCallback((f: JobFilters, p: number) => {
    const params = new URLSearchParams()
    if (f.query) params.set('query', f.query)
    if (f.location) params.set('location', f.location)
    if (f.remote) params.set('remote', 'true')
    if (f.fullTime) params.set('fullTime', 'true')
    if (f.internship) params.set('internship', 'true')
    if (f.entryLevel) params.set('entryLevel', 'true')
    if (p > 1) params.set('page', String(p))
    return params.toString()
  }, [])

  const fetchJobs = useCallback(async (f: JobFilters, p = 1) => {
    setIsLoading(true)
    try {
      const qs = buildParams(f, p)
      const res = await fetch(`/api/jobs?${qs}`)
      const data = await res.json()
      if (data.success) {
        setJobs(data.jobs)
        setTotalPages(data.totalPages || 1)
        setPage(p)
        // Sync URL
        router.replace(`${pathname}?${qs}`, { scroll: false })
      }
    } catch (err) {
      console.error('fetchJobs error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [buildParams, router, pathname])

  // Debounced/Immediate fetch based on changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    
    // For text inputs, debounce. For toggles, fetch immediately.
    // We can check what changed, but simpler is to just debounce everything slightly 
    // or handle toggles specifically. Let's debounce everything for stability.
    debounceTimer.current = setTimeout(() => {
      fetchJobs(filters, 1)
    }, 400)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [
    filters.query, 
    filters.location, 
    filters.remote, 
    filters.fullTime, 
    filters.internship, 
    filters.entryLevel,
    fetchJobs
  ])

  const setFilter = useCallback(<K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleFilter = useCallback((key: 'remote' | 'fullTime' | 'internship' | 'entryLevel') => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const search = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    fetchJobs(filters, 1)
  }, [filters, fetchJobs])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    fetchJobs(DEFAULT_FILTERS, 1)
  }, [fetchJobs])

  return {
    filters,
    setFilter,
    toggleFilter,
    search,
    resetFilters,
    jobs,
    setJobs,
    isLoading,
    page,
    totalPages,
    setPage: (p: number) => fetchJobs(filters, p)
  }
}

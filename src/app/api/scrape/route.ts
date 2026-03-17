import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''

  try {
    // First: check if we already have matching jobs in our DB
    let dbQuery = supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (query) {
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,company.ilike.%${query}%,description.ilike.%${query}%`
      )
    }

    const { data: existingJobs } = await dbQuery

    if (existingJobs && existingJobs.length > 0) {
      return NextResponse.json({ success: true, count: existingJobs.length, jobs: existingJobs })
    }

    // Second: fetch from The Muse API (free, no API key required)
    const museCategory = query || 'Software Engineering'
    const museUrl = `https://www.themuse.com/api/public/jobs?category=${encodeURIComponent(museCategory)}&page=0&descending=true`

    const museRes = await fetch(museUrl, { headers: { Accept: 'application/json' } })
    const museData = await museRes.json()
    const museJobs: any[] = museData.results || []

    if (museJobs.length === 0) {
      return NextResponse.json({ success: true, count: 0, jobs: [] })
    }

    const jobsToInsert = museJobs.slice(0, 20).map((job: any) => ({
      title: job.name || 'Untitled',
      company: job.company?.name || 'Unknown',
      location: job.locations?.map((l: any) => l.name).join(', ') || 'Remote',
      job_type: job.levels?.[0]?.name || 'Full-time',
      description: (job.contents || '').replace(/<[^>]*>/g, '').slice(0, 600),
      apply_link: job.refs?.landing_page || `https://www.themuse.com/${job.short_name}`,
      source: 'The Muse',
      raw_data: { categories: job.categories, levels: job.levels }
    }))

    // Try insert into Supabase
    const { data, error } = await supabase.from('jobs').insert(jobsToInsert).select()
    if (error) console.warn('Supabase insert warning:', error.message)

    return NextResponse.json({
      success: true,
      count: data?.length ?? jobsToInsert.length,
      jobs: data?.length ? data : jobsToInsert
    })

  } catch (error: any) {
    console.error('Scrape API Error:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

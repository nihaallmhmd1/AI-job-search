import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('query') || ''
  const location = searchParams.get('location') || ''
  const remote = searchParams.get('remote') === 'true'
  const fullTime = searchParams.get('fullTime') === 'true'
  const internship = searchParams.get('internship') === 'true'
  const entryLevel = searchParams.get('entryLevel') === 'true'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 18
  const offset = (page - 1) * limit

  try {
    let dbQuery = supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Text search on title and description
    if (query) {
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,company.ilike.%${query}%`
      )
    }

    // Location filter
    if (location) {
      dbQuery = dbQuery.ilike('location', `%${location}%`)
    }

    // Job type filters
    const typeFilters: string[] = []
    if (remote) typeFilters.push('Remote')
    if (fullTime) typeFilters.push('Full-time')
    if (internship) typeFilters.push('Internship')

    if (typeFilters.length > 0) {
      // Match any of the selected types
      const orClause = typeFilters.map(t => `job_type.ilike.%${t}%`).join(',')
      dbQuery = dbQuery.or(orClause)
    }

    // Entry Level filter on description/title
    if (entryLevel) {
      dbQuery = dbQuery.or(`title.ilike.%entry%,description.ilike.%entry level%,description.ilike.%junior%`)
    }

    const { data, error, count } = await dbQuery

    if (error) {
      console.error('Jobs API error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // --- Scraping Fallback ---
    // If no jobs found and we have a query, try to scrape
    if (data && data.length === 0 && query && page === 1) {
      const { scrapeJobs } = await import('@/lib/firecrawl')
      const scrapedJobs = await scrapeJobs(query, location)
      
      if (scrapedJobs.length > 0) {
        // Insert into DB for future searches
        const { data: insertedJobs, error: insertError } = await supabase
          .from('jobs')
          .insert(scrapedJobs)
          .select()
        
        if (!insertError && insertedJobs) {
          return NextResponse.json({
            success: true,
            jobs: insertedJobs,
            total: insertedJobs.length,
            page: 1,
            totalPages: 1,
            isScraped: true
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      jobs: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

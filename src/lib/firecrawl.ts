import FirecrawlClient from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlClient({
  apiKey: process.env.FIRECRAWL_API_KEY
});

export interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  apply_link: string;
  source: string;
}

export async function scrapeJobs(query: string, location: string = ''): Promise<ScrapedJob[]> {
  if (!process.env.FIRECRAWL_API_KEY) {
    console.warn('FIRECRAWL_API_KEY is not set');
    return [];
  }

  const searchDir = `${query} ${location} jobs`.trim();
  
  try {
    const searchResponse = await firecrawl.search(searchDir, {
      limit: 10
    });

    // The search endpoint returns SearchData which has web, news, and images arrays
    const results = searchResponse.web || [];
    
    const jobs: ScrapedJob[] = results.map((item: any) => {
      return {
        title: item.title || query,
        company: 'Unknown', 
        location: location || 'Remote',
        job_type: 'Full-time', 
        description: item.description || '',
        apply_link: item.url,
        source: 'Firecrawl Search'
      };
    });

    return jobs;
  } catch (error) {
    console.error('Firecrawl scraping error:', error);
    return [];
  }
}

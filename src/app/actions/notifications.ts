'use server'

import { createClient } from '@/lib/supabase/server'
import { getJobRecommendations } from './ai'
import { getUserPreferences } from './preferences'

export async function getNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const prefs = await getUserPreferences()
  if (!prefs?.notifications_enabled) return []

  // Fetch recommendations as notifications
  const recommendations = await getJobRecommendations()
  
  // Return top 5 as "new notifications"
  return recommendations.slice(0, 5).map((job: any) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    time: 'New Match',
    type: 'job_match'
  }))
}

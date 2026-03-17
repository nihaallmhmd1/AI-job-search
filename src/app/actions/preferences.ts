'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserPreferences() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('user_job_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching preferences', error)
    return null
  }

  return data
}

export async function saveUserPreferences(preferences: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('user_job_preferences')
    .upsert({
      user_id: user.id,
      ...preferences,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) {
    console.error('Error saving preferences', error)
    throw new Error('Failed to save preferences')
  }

  revalidatePath('/dashboard')
  revalidatePath('/')

  return data
}

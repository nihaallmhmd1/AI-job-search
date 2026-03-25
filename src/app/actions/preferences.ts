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

  const { data: existing } = await supabase
    .from('user_job_preferences')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  let result
  if (existing) {
    const { data, error } = await supabase
      .from('user_job_preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single()
    
    if (error) throw error
    result = data
  } else {
    const { data, error } = await supabase
      .from('user_job_preferences')
      .insert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
      
    if (error) throw error
    result = data
  }

  revalidatePath('/dashboard')
  revalidatePath('/')

  return result
}

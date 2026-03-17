'use client'

import { useState, useEffect } from 'react'
import { Bell, Briefcase, Loader2, X } from 'lucide-react'
import { getNotifications } from '@/app/actions/notifications'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const data = await getNotifications()
        setNotifications(data)
      } catch (e) {
        console.error('Failed to fetch notifications', e)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifs()
  }, [])

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-xl transition-all relative",
          isOpen ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <Bell className="w-4 h-4" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-200" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Checking for matches...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <Link 
                    key={n.id} 
                    href={`/dashboard?query=${encodeURIComponent(n.title)}`}
                    onClick={() => setIsOpen(false)}
                    className="p-4 hover:bg-gray-50 block transition-colors group"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-900 mb-0.5 line-clamp-1">{n.title}</p>
                        <p className="text-[10px] text-gray-500 mb-2">{n.company}</p>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-md uppercase tracking-tightest">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  No new matches yet.<br/>We'll notify you here.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
             <Link href="/preferences" className="text-[10px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest">
                Manage Notification Settings
             </Link>
          </div>
        </div>
      )}
    </div>
  )
}

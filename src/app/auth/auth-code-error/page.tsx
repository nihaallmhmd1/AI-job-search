'use client'

import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
      <p className="text-gray-500 max-w-sm mb-4">
        We couldn't verify your login. This can happen if the link has expired or has already been used.
      </p>

      {error && (
        <div className="mb-8 p-3 bg-red-50 border border-red-100 rounded-lg text-[11px] text-red-600 font-medium break-all max-w-sm">
          Error: {decodeURIComponent(error)}
        </div>
      )}

      <Link 
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}

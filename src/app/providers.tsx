'use client'

import { ThemeProvider } from 'next-themes'
import { PWAProvider } from '@/components/PWAContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <PWAProvider>{children}</PWAProvider>
    </ThemeProvider>
  )
}

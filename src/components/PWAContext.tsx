'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface PWAContextValue {
  isInstallable: boolean
  isInstalled: boolean
  isIOS: boolean
  isAndroid: boolean
  isDesktop: boolean
  isModalOpen: boolean
  openInstallModal: () => void
  closeInstallModal: () => void
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'manual'>
}

const PWAContext = createContext<PWAContextValue | null>(null)

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const [isAndroid, setIsAndroid] = useState<boolean>(false)
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    // 1. Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(userAgent)
    const android = /android/.test(userAgent)
    const desktop = !ios && !android

    setIsIOS(ios)
    setIsAndroid(android)
    setIsDesktop(desktop)

    // 2. Check if already running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true

    if (isStandalone) {
      setIsInstalled(true)
    }

    // 3. Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registered with scope:', reg.scope))
        .catch((err) => console.warn('Service Worker registration failed:', err))
    }

    // 4. Capture beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setIsModalOpen(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const openInstallModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeInstallModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual'> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        setDeferredPrompt(null)
        if (choice.outcome === 'accepted') {
          setIsInstalled(true)
          setIsModalOpen(false)
          return 'accepted'
        }
        return 'dismissed'
      } catch (err) {
        console.error('Install prompt error:', err)
      }
    }
    // If no native prompt available (iOS or browser already handled), open guide modal
    setIsModalOpen(true)
    return 'manual'
  }, [deferredPrompt])

  const isInstallable = !isInstalled && (!!deferredPrompt || isIOS || isAndroid || isDesktop)

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isIOS,
        isAndroid,
        isDesktop,
        isModalOpen,
        openInstallModal,
        closeInstallModal,
        promptInstall,
      }}
    >
      {children}
    </PWAContext.Provider>
  )
}

export function usePWA() {
  const ctx = useContext(PWAContext)
  if (!ctx) {
    throw new Error('usePWA must be used within a PWAProvider')
  }
  return ctx
}

'use client'

export interface GoogleUser {
  name: string
  email: string
  picture?: string
}

const GOOGLE_USER_KEY = 'urgut_google_user_v1'
const CLIENT_ID_KEY = 'urgut_client_uuid_v1'

// Get or create persistent device/browser ID for likes & statistics
export function getClientIdentifier(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36)
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

// Get saved Google user
export function getGoogleUser(): GoogleUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(GOOGLE_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Save Google user
export function setGoogleUser(user: GoogleUser | null): void {
  if (typeof window === 'undefined') return
  if (!user) {
    localStorage.removeItem(GOOGLE_USER_KEY)
  } else {
    localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(user))
  }
  window.dispatchEvent(new Event('google-user-changed'))
}

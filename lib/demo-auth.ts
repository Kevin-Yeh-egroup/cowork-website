"use client"

import { useEffect, useState } from "react"

export type DemoUserRole = "member" | "social_worker"

export type DemoAuthState = {
  isLoggedIn: boolean
  role: DemoUserRole | null
}

export const demoAuthChangeEvent = "cilia-demo-auth-change"

const storageKey = "cilia-demo-auth"
const defaultAuthState: DemoAuthState = {
  isLoggedIn: false,
  role: null,
}

function isDemoUserRole(role: unknown): role is DemoUserRole {
  return role === "member" || role === "social_worker"
}

function normalizeAuthState(value: unknown): DemoAuthState {
  if (!value || typeof value !== "object") return defaultAuthState

  const candidate = value as Partial<DemoAuthState>
  const role = isDemoUserRole(candidate.role) ? candidate.role : null

  return {
    isLoggedIn: Boolean(candidate.isLoggedIn),
    role,
  }
}

export function getDemoAuthState(): DemoAuthState {
  if (typeof window === "undefined") return defaultAuthState

  try {
    const storedState = window.localStorage.getItem(storageKey)
    if (!storedState) return defaultAuthState

    return normalizeAuthState(JSON.parse(storedState))
  } catch {
    return defaultAuthState
  }
}

export function getRoleHomePath(role: DemoUserRole) {
  return role === "member" ? "/personal-center" : "/social-worker"
}

export function getAuthHomePath(authState: DemoAuthState) {
  if (!authState.isLoggedIn || !authState.role) return "/login"

  return getRoleHomePath(authState.role)
}

export function setDemoAuthState(authState: DemoAuthState) {
  if (typeof window === "undefined") return

  const normalizedState = normalizeAuthState(authState)
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(normalizedState))
  } catch {
    // The demo login should still work when browser storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent<DemoAuthState>(demoAuthChangeEvent, { detail: normalizedState }))
}

export function clearDemoAuthState() {
  setDemoAuthState(defaultAuthState)
}

export function useDemoAuth() {
  const [authState, setAuthState] = useState<DemoAuthState>(defaultAuthState)
  const [isReady, setIsReady] = useState(true)

  useEffect(() => {
    let fallbackTimer: ReturnType<typeof window.setTimeout> | null = null

    const syncAuthState = () => {
      setAuthState(getDemoAuthState())
      setIsReady(true)
    }

    const handleDemoAuthChange = (event: Event) => {
      const nextState = (event as CustomEvent<DemoAuthState>).detail
      setAuthState(normalizeAuthState(nextState))
      setIsReady(true)
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey) {
        syncAuthState()
      }
    }

    syncAuthState()
    fallbackTimer = window.setTimeout(() => {
      setIsReady(true)
    }, 300)
    window.addEventListener(demoAuthChangeEvent, handleDemoAuthChange)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      if (fallbackTimer) window.clearTimeout(fallbackTimer)
      window.removeEventListener(demoAuthChangeEvent, handleDemoAuthChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const login = () => {
    setDemoAuthState({ isLoggedIn: true, role: authState.role })
  }

  const chooseRole = (role: DemoUserRole) => {
    setDemoAuthState({ isLoggedIn: true, role })
  }

  const logout = () => {
    clearDemoAuthState()
  }

  return {
    authState,
    isReady,
    login,
    chooseRole,
    logout,
  }
}

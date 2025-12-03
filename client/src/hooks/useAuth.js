'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook para manejar autenticación
 */
export function useAuth() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const supabase = createClient()

  // ============================================
  // OBTENER SESIÓN ACTUAL
  // ============================================
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true)

        // Obtener sesión actual
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error

        setSession(session)
        setUser(session?.user || null)
      } catch (err) {
        console.error('Error getting session:', err)
        setError(err.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  // ============================================
  // LOGIN
  // ============================================
  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        setUser(data.user)
        setSession(data.session)

        // Redirigir después del login
        const redirect = searchParams.get('redirect') || '/admin/dashboard'
        router.push(redirect)

        return { success: true, user: data.user }
      } catch (err) {
        const errorMessage = err.message || 'Error al iniciar sesión'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [supabase, router, searchParams]
  )

  // ============================================
  // LOGOUT
  // ============================================
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      setUser(null)
      setSession(null)
      router.push('/admin/login')

      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Error al cerrar sesión'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  // ============================================
  // SIGNUP (Registro)
  // ============================================
  const signup = useCallback(
    async (email, password) => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        return {
          success: true,
          user: data.user,
          message: 'Verifica tu email para confirmar tu cuenta',
        }
      } catch (err) {
        const errorMessage = err.message || 'Error al registrarse'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [supabase]
  )

  // ============================================
  // RESETEAR CONTRASEÑA
  // ============================================
  const resetPassword = useCallback(
    async (email) => {
      try {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/resetear-password`,
        })

        if (error) throw error

        return {
          success: true,
          message: 'Email de recuperación enviado',
        }
      } catch (err) {
        const errorMessage = err.message || 'Error al resetear contraseña'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [supabase]
  )

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    resetPassword,
  }
}
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true); setTimeout(() => router.push('/dashboard'), 1500) }
  }

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthColor = ['transparent', '#ef4444', '#f59e0b', '#22c55e'][passwordStrength]
  const strengthLabel = ['', 'Too short', 'Good', 'Strong'][passwordStrength]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif", padding: '24px' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes success { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .signup-input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.2) !important; }
        .signup-btn:hover:not(:disabled) { background: #4f46e5 !important; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99,102,241,0.4) !important; }
        .login-link:hover { color: #818cf8 !important; }
        .signup-input { background: rgba(255,255,255,0.05) !important; }
        .signup-input:hover { border-color: rgba(99,102,241,0.4) !important; }
      `}</style>

      {/* Background glows */}
      <div style={{ position: 'fixed', top: '20%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '10%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeIn 0.6s ease' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(99,102,241,0.3)', animation: 'float 3s ease-in-out infinite' }}>✦</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Create account</h1>
          <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>Start building better habits today</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '36px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>

          {/* Success State */}
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0', animation: 'success 0.4s ease' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>✓</div>
              <h3 style={{ color: '#22c55e', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Account created!</h3>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚠</span> {error}
                </div>
              )}

              <form onSubmit={handleSignup}>
                {/* Email */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#d1d5db', marginBottom: 8, letterSpacing: '0.3px' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="signup-input"
                    style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 15, transition: 'all 0.2s', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#d1d5db', marginBottom: 8, letterSpacing: '0.3px' }}>
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className="signup-input"
                    style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 15, transition: 'all 0.2s', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Password Strength */}
                {password.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= passwordStrength ? strengthColor : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: strengthColor, fontWeight: 500 }}>{strengthLabel}</span>
                  </div>
                )}

                {!password.length && <div style={{ marginBottom: 24 }} />}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="signup-btn"
                  style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(99,102,241,0.3)', opacity: loading ? 0.7 : 1, letterSpacing: '0.3px' }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                      Creating account...
                    </span>
                  ) : 'Create Account →'}
                </button>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ color: '#4b5563', fontSize: 13 }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              </div>

              <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', margin: 0 }}>
                Already have an account?{' '}
                <Link href="/login" className="login-link" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}>
                  Sign in →
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Features */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
          {['Free forever', 'No credit card', 'Instant setup'].map(f => (
            <span key={f} style={{ fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#6366f1' }}>✓</span> {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
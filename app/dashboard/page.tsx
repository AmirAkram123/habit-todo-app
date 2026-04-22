'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Habit = {
  id: string
  title: string
  completed: boolean
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserEmail(user.email || '')
      await fetchHabits()
      setLoading(false)
    }
    init()
  }, [])

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from('habits').select('*').order('created_at', { ascending: false })
    if (!error && data) setHabits(data)
  }

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabit.trim()) return
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('habits').insert({ title: newHabit.trim(), user_id: user?.id })
    if (!error) { setNewHabit(''); await fetchHabits() }
    setAdding(false)
  }

  const toggleHabit = async (id: string, completed: boolean) => {
    const { error } = await supabase.from('habits').update({ completed: !completed }).eq('id', id)
    if (!error) await fetchHabits()
  }

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id)
    if (!error) await fetchHabits()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const completedCount = habits.filter(h => h.completed).length
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f1a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#a0a0b0', fontSize: 16 }}>Loading your habits...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg) } }
        .habit-row:hover { background: rgba(99,102,241,0.08) !important; transform: translateX(4px); }
        .habit-row { transition: all 0.2s ease; }
        .delete-btn:hover { color: #f87171 !important; background: rgba(248,113,113,0.1) !important; }
        .add-btn:hover { background: #4f46e5 !important; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99,102,241,0.4) !important; }
        .logout-btn:hover { background: rgba(248,113,113,0.15) !important; color: #f87171 !important; }
        input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.2) !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>HabitFlow</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }} />
              <span style={{ fontSize: 13, color: '#a0a0b0' }}>{userEmail}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn" style={{ fontSize: 13, color: '#a0a0b0', padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>

        {/* Hero Section */}
        <div style={{ marginBottom: 36, animation: 'fadeIn 0.5s ease' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: 16, margin: 0 }}>
            {habits.length === 0 ? "Start building great habits today." : `You've completed ${completedCount} of ${habits.length} habits today.`}
          </p>
        </div>

        {/* Stats Cards */}
        {habits.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32, animation: 'fadeIn 0.5s ease 0.1s both' }}>
            {[
              { label: 'Total', value: habits.length, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
              { label: 'Completed', value: completedCount, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
              { label: 'Pending', value: habits.length - completedCount, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.color}25`, borderRadius: 16, padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {habits.length > 0 && (
          <div style={{ marginBottom: 32, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 0.5s ease 0.15s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#a0a0b0', fontWeight: 500 }}>Daily Progress</span>
              <span style={{ fontSize: 13, color: '#6366f1', fontWeight: 700 }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )}

        {/* Add Habit Form */}
        <form onSubmit={addHabit} style={{ display: 'flex', gap: 12, marginBottom: 32, animation: 'fadeIn 0.5s ease 0.2s both' }}>
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit or task..."
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px', color: '#fff', fontSize: 15, transition: 'all 0.2s' }}
          />
          <button type="submit" disabled={adding} className="add-btn" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
            {adding ? '...' : '+ Add'}
          </button>
        </form>

        {/* Habits List */}
        {habits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🌱</div>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No habits yet</h3>
            <p style={{ color: '#6b7280', fontSize: 15 }}>Add your first habit above to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeIn 0.5s ease 0.25s both' }}>
            {habits.map((habit, i) => (
              <div key={habit.id} className="habit-row" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${habit.completed ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, animationDelay: `${i * 0.05}s` }}>
                {/* Custom Checkbox */}
                <div onClick={() => toggleHabit(habit.id, habit.completed)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${habit.completed ? '#6366f1' : 'rgba(255,255,255,0.2)'}`, background: habit.completed ? '#6366f1' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
                  {habit.completed && <span style={{ color: '#fff', fontSize: 13, lineHeight: 1 }}>✓</span>}
                </div>

                {/* Title */}
                <span style={{ flex: 1, color: habit.completed ? '#4b5563' : '#e5e7eb', fontSize: 15, textDecoration: habit.completed ? 'line-through' : 'none', transition: 'all 0.2s' }}>
                  {habit.title}
                </span>

                {/* Badge */}
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: habit.completed ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: habit.completed ? '#22c55e' : '#f59e0b', border: `1px solid ${habit.completed ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                  {habit.completed ? '✓ Done' : '● Pending'}
                </span>

                {/* Delete */}
                <button onClick={() => deleteHabit(habit.id)} className="delete-btn" style={{ color: '#4b5563', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, padding: '4px 8px', borderRadius: 6, transition: 'all 0.2s', lineHeight: 1 }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
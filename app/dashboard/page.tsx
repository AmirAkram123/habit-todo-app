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

  // Check if user is logged in + fetch habits
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserEmail(user.email || '')
      await fetchHabits()
      setLoading(false)
    }

    init()
  }, [])

  // Fetch all habits for this user
  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setHabits(data)
    }
  }

  // Add a new habit
  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabit.trim()) return
    setAdding(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('habits')
      .insert({ title: newHabit.trim(), user_id: user?.id })

    if (!error) {
      setNewHabit('')
      await fetchHabits()
    }
    setAdding(false)
  }

  // Toggle complete/incomplete
  const toggleHabit = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('habits')
      .update({ completed: !completed })
      .eq('id', id)

    if (!error) {
      await fetchHabits()
    }
  }

  // Delete a habit
  const deleteHabit = async (id: string) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)

    if (!error) {
      await fetchHabits()
    }
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">📋 My Habits</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Add Habit Form */}
        <form onSubmit={addHabit} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit or task..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add'}
          </button>
        </form>

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-lg">No habits yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={habit.completed}
                  onChange={() => toggleHabit(habit.id, habit.completed)}
                  className="w-5 h-5 cursor-pointer accent-blue-600"
                />

                {/* Title */}
                <span
                  className={`flex-1 text-gray-800 ${
                    habit.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {habit.title}
                </span>

                {/* Status Badge */}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    habit.completed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {habit.completed ? 'Done' : 'Pending'}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-400 hover:text-red-600 transition text-lg font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {habits.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-400">
            {habits.filter(h => h.completed).length} of {habits.length} completed
          </div>
        )}
      </div>
    </div>
  )
}
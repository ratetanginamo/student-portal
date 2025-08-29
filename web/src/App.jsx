import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import API from './api'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Courses from './pages/Courses'
import Assignments from './pages/Assignments'
import Calendar from './pages/Calendar'
import Profile from './pages/Profile'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const nav = useNavigate()

  async function loginDemo(){
    try{
      const { data } = await API.post('/auth/login', { email:'demo@student.test', password:'demo123' })
      localStorage.setItem('token', data.token); setToken(data.token)
    }catch{
      const { data } = await API.post('/auth/register', { full_name:'Demo Student', email:'demo@student.test', password:'demo123', role:'student', program:'BSIT', year_level:1 })
      localStorage.setItem('token', data.token); setToken(data.token)
    }
    nav('/')
  }

  function logout(){ localStorage.removeItem('token'); setToken(null); }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-4 py-3 bg-white shadow flex items-center gap-3">
        <Link to="/" className="font-bold text-xl">Student Portal</Link>
        <nav className="flex gap-3 text-sm">
          <Link to="/courses">Courses</Link>
          <Link to="/assignments">Assignments</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <div className="ml-auto">
          {token ? <button onClick={logout} className="px-3 py-1 rounded bg-black text-white">Logout</button>
                 : <button onClick={loginDemo} className="px-3 py-1 rounded bg-black text-white">Demo Login</button>}
        </div>
      </header>
      <main className="p-4 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}

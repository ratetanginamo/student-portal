import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import API from '../api'

export default function Chat(){
  const [room, setRoom] = useState('general')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef(null)

  useEffect(()=>{
    async function init(){
      const token = localStorage.getItem('token');
      if (!token) return alert('Use Demo Login first.');
      const { data } = await API.get(`/chat/${room}`)
      setMessages(data)
      socketRef.current = io('http://localhost:8080', { auth: { token } })
      socketRef.current.emit('join', room)
      socketRef.current.on('message', (m)=> setMessages(prev=> [...prev, m]))
    }
    init()
    return ()=>{ socketRef.current?.disconnect() }
  },[room])

  function send(){
    if (!text.trim()) return
    socketRef.current?.emit('message', { room, body: text })
    setText('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Chat</h1>
      <div className="mb-2 flex gap-2">
        <input value={room} onChange={e=>setRoom(e.target.value)} className="border rounded px-2 py-1" />
        <button onClick={()=>{}} className="px-3 py-1 rounded bg-black text-white">Join</button>
      </div>
      <div className="h-80 overflow-y-auto p-3 bg-white rounded-xl shadow">
        {messages.map(m=> (
          <div key={m.id} className="py-1 text-sm"><span className="text-gray-500">[{m.created_at?.slice(11,19)}]</span> {m.body}</div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Type a message..." />
        <button onClick={send} className="px-3 py-1 rounded bg-black text-white">Send</button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import API from '../api'
export default function Dashboard(){
  const [ann, setAnn] = useState([])
  useEffect(()=>{ API.get('/announcements').then(r=>setAnn(r.data)).catch(()=>{}) },[])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {ann.map(a=> (
          <div key={a.id} className="p-4 bg-white rounded-xl shadow">
            <div className="text-sm text-gray-500">{a.author}</div>
            <div className="mt-1">{a.content}</div>
          </div>
        ))}
        {!ann.length && <div className="text-gray-500">No announcements yet.</div>}
      </div>
    </div>
  )
}

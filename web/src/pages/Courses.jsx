import { useEffect, useState } from 'react'
import API from '../api'
export default function Courses(){
  const [rows, setRows] = useState([])
  useEffect(()=>{ API.get('/courses').then(r=>setRows(r.data)).catch(()=>{}) },[])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Courses</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {rows.map(c=> (
          <div key={c.id} className="p-4 bg-white rounded-xl shadow">
            <div className="font-medium">{c.code} — {c.title}</div>
            {c.description && <p className="text-sm text-gray-600">{c.description}</p>}
          </div>
        ))}
        {!rows.length && <div className="text-gray-500">No courses yet.</div>}
      </div>
    </div>
  )
}

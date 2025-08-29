import { useEffect, useState } from 'react'
import API from '../api'
export default function Assignments(){
  const [rows, setRows] = useState([])
  useEffect(()=>{ API.get('/assignments').then(r=>setRows(r.data)).catch(()=>{}) },[])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Assignments</h1>
      <div className="space-y-3">
        {rows.map(a=> (
          <div key={a.id} className="p-4 bg-white rounded-xl shadow">
            <div className="font-medium">{a.title}</div>
            <div className="text-sm text-gray-600">Course #{a.course_id} • Due: {a.due_at || '—'}</div>
            {a.instructions && <p className="text-sm mt-1">{a.instructions}</p>}
          </div>
        ))}
        {!rows.length && <div className="text-gray-500">No assignments yet.</div>}
      </div>
    </div>
  )
}

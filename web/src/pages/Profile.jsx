import { useEffect, useState } from 'react'
import API from '../api'
export default function Profile(){
  const [me, setMe] = useState(null)
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) return
    try{ setMe(JSON.parse(atob(token.split('.')[1]))) }catch{}
  },[])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Profile</h1>
      {!me ? <div>Please login (use Demo Login).</div> : (
        <div className="p-4 bg-white rounded-xl shadow">
          <div><span className="font-medium">User ID:</span> {me.id}</div>
          <div><span className="font-medium">Email:</span> {me.email}</div>
          <div><span className="font-medium">Role:</span> {me.role}</div>
        </div>
      )}
    </div>
  )
}

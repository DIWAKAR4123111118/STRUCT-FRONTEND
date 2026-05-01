'use client'

import { useState } from 'react'
import axios from 'axios'

export default function SignupPage() {
  const [contractorName, setContractorName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        { contractorName, email, password, phone }
      )
      localStorage.setItem('token', res.data.token)
      window.location.href = '/dashboard'
    } catch (err) {
      console.error(err)
      alert('Signup failed')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h1>Sign up</h1>
      <form onSubmit={handleSignup}>
        <input
          placeholder="Contractor name"
          value={contractorName}
          onChange={e => setContractorName(e.target.value)}
        /><br />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <input
          placeholder="Phone (optional)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        /><br />
        <button type="submit">Sign up</button>
      </form>
    </div>
  )
}
'use client'

import { useState } from 'react'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    console.log('Submitting login', email, password)

    try {
      console.log('API URL =', process.env.NEXT_PUBLIC_API_URL)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      )
      console.log('Login response', res.data)
      localStorage.setItem('token', res.data.token)
      window.location.href = '/dashboard'
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
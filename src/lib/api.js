import axios from 'axios';

export function api() {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
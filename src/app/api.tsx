'use client'
import axios from "axios";

// const cookies = getCookies()
const cookies = ''

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

export default api;

export function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = sessionStorage.getItem('token');
  return token;
}
'use client'
import axios from "axios";

const token = getToken()

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  }
})

export default api;

export function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = sessionStorage.getItem('token');
  return token;
}
'use client'
import axios, { AxiosInstance } from "axios";

function getCSRFToken() {
  if (typeof window !== 'undefined') {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
          return value;
        }
      }
      return '';
    }
  }
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: "X-CSRFTOKEN",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCSRFToken()
  }
})

export default api 
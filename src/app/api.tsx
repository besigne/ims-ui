'use client'
import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'csrftoken',
})

export default api 

export const login: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})
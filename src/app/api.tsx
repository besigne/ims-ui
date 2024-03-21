'use client'
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/router';

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

export const api = axios.create({
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

export async function postData(url: string, data: any,onSuccess: () => void, onError: () => void) {
  const router = useRouter();

  try {
    const response = await api.post(url, data);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if(axiosError.response && axiosError.response.status === 403) {
        router.push('/login');
      }
    }
  } finally {

  }
}


'use client'
import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { convertUser, verify } from '@/components/functions';
import { User } from '@/components/interface';
import Loading from '@/components/loading';
import UserForm from '@/components/userForm';
import { useRouter } from 'next/navigation';
import Bar from '@/components/bar';
import api from '../api';

export default function User() {
  const [user, setUser] = React.useState<User>({ id: 0, username: '', first_name: '', email: '', is_staff: false, is_active: false, last_login: '', date_joined: '' })
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    verify()
    setUser(convertUser())
    if (user.id != 0) {
      setLoading(false)
    }
  }, [user.id != 0])

  const logout = (username: string) => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${username}/`)
    socket.close()
    sessionStorage.clear()
    api.post('/logout')
    router.push('/login')
  }

  return (
    <>
      {!loading ?
        <Box className="container">
          <Bar title={'User settings'} user={user} logout={() => logout(user.first_name)} />
          <Box className="m-4 p-2 d-flex justify-content-center">
            <UserForm user={user} />
          </Box>
        </Box>
        :
        <Loading />
      }
    </>
  );
}

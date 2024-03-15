'use client'
import React from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import Bar from '@/components/bar';
import { convertUser, verify } from '@/components/functions';
import { User } from '@/components/interface';
import Loading from '@/components/loading';
import UserForm from '@/components/userForm';

export default function User() {
  const [user, setUser] = React.useState<User>({ id: 0, username: '', first_name: '', email: '', is_staff: false, is_active: false, last_login: '', date_joined: '' })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    verify()
    setUser(convertUser())
    if (user.id != 0) {
      setLoading(false)
    }
  }, [user.id != 0])

  return (
    <>
      {!loading ?
        <Box className="container">
          <Bar title={'Administrator settings'} user={user.username} />
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

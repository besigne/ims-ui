'use client'
import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import Bar from '@/components/bar';
import { convertUser, verify } from '@/components/functions';
import { User } from '@/components/interface';

export default function User() {
  const [user, setUser] = React.useState<User>({ id: 0, username: '', first_name: '', is_staff: false, is_active: false, last_login: '', date_joined: '' })
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
      <Box className="container">
        <Bar title={'User Settings'} user={user.username} />
      </Box>
    </>
  );
}

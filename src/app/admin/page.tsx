'use client'
import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import Bar from '@/components/bar';
import { convertUser, verify } from '@/components/functions';
import { User } from '@/components/interface';
import Loading from '@/components/loading';


export default function Admin() {
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
    {!loading ?
      <Box className="container">
        <Bar title={'Administrator settings'} user={user.username} />
      </Box>
       :
       <Loading />
     }
    </>
  );
}

'use client'
import React from 'react'
import { User } from './interface'
import { Box, Paper } from '@mui/material'

interface Component {
  user: User
}

const UserForm: React.FC<Component> = ({ user }) => {

  return (
    <Paper className='col-12 d-flex justify-content-center align-items-center'>
      <Box className="col-11">
        {user.id} / {user.username} / {user.last_login}
      </Box>
    </Paper>
  )
}

export default UserForm
'use client'
import React from 'react'
import SideMenu from '@/components/sidemenu';
import { Box, Button, Typography } from '@mui/material'
import { User } from './interface';

interface Component {
  title: string,
  user: User
}

const Bar: React.FC<Component> = ({title = "", user}) => {
  const [statusDrawer, setStatusDrawer] = React.useState(false);

  const handleStatusDrawer = () => {
    setStatusDrawer(!statusDrawer)
  }
  return (
    <>
    <Box className="d-flex">
        <Box className="col-1 ms-auto p-2">
        </Box>
        <Box className="col m-2 p-2 d-flex justify-content-center"  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: '5px'}}>
          <Typography color={'white'}>
            {title}  
          </Typography>
        </Box>
        <Box className="col-1 ms-auto p-2">
          <Button variant='text' onClick={handleStatusDrawer} color="info">Menu</Button>
        </Box>
      </Box>
      <SideMenu open={statusDrawer} handleChange={handleStatusDrawer} user={user} />
    </>
  )
}

export default Bar
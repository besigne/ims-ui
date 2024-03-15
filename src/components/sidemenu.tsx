'use client'
import React from 'react'
import { Drawer } from "@mui/material"
import Menu from '@/components/menu';
import { User } from './interface';

interface Component {
  user: User,
  open: boolean
  handleChange: () => void
}

const SideMenu: React.FC<Component> = ({ open, handleChange, user}) => {

  return (
    <Drawer
        anchor={'right'}
        open={open}
        onClose={handleChange}
      >
        <Menu user={user} />
    </Drawer>
  )
}

export default SideMenu
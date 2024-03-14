'use client'
import React from 'react'
import { Drawer } from "@mui/material"
import Menu from '@/components/menu';

interface Component {
  username: string,
  open: boolean
  handleChange: () => void
}

const SideMenu: React.FC<Component> = ({ open, handleChange, username}) => {

  return (
    <Drawer
        anchor={'right'}
        open={open}
        onClose={handleChange}
      >
        <Menu username={username} />
    </Drawer>
  )
}

export default SideMenu
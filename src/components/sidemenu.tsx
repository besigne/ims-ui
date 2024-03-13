'use client'
import React from 'react'
import { Drawer } from "@mui/material"
import Menu from '@/components/menu';

interface Component {
  // user: object,
  open: boolean
  handleChange: () => void
}

const SideMenu: React.FC<Component> = ({ open, handleChange}) => {

  return (
    <Drawer
        anchor={'right'}
        open={open}
        onClose={handleChange}
      >
        <Menu username={'matheus'} />
    </Drawer>
  )
}

export default SideMenu
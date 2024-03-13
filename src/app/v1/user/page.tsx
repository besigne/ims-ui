'use client'
import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import Bar from '@/components/bar';

export default function Home() {

  return (
    <>
      <Box className="container">
        <Bar title={'User Settings'} />
      </Box>
    </>
  );
}

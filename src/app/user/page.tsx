'use client'
import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import Bar from '@/components/bar';
import { verify } from '@/components/functions';

export default function Home() {

  React.useEffect(() => {
    verify()
  }, [])

  return (
    <>
      <Box className="container">
        <Bar title={'User Settings'} />
      </Box>
    </>
  );
}

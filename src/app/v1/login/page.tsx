'use client'
import React from 'react'
import { Box, Paper, TextField } from '@mui/material'

export default function Login() {

  return (
    <Box className="container">
      <Box className="flex justify-content-center align-items-center" sx={{ height: '60vh' }}>
        <Box className="col-6 d-flex justify-content-center">
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Paper elevation={3}>
              <Box component="form" className="m-2 p-2" sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}>
                <Box className="text-center">Login</Box>
                <Box>
                  <TextField
                    required
                    label="Username"
                    variant="standard"
                  />
                </Box>
                <Box>
                  <TextField
                    required
                    label="Password"
                    variant="standard"
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
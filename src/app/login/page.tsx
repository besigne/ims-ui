'use client'
import React from 'react'
import { Box, Button, ButtonGroup, FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, Paper } from '@mui/material'
import { PersonOutline, Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = React.useState<LoginForm>({username: '', password: ''})
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    console.log(formData)
    const response = await fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    console.log(response)
    if(response.ok) {
      console.log('login')
    } else {
      console.error('failed')
    }

  }

  return (
    <Box className="container">
      <Box className="flex justify-content-center align-items-center" sx={{ height: '60vh' }}>
        <Box className="col-6 d-flex justify-content-center">
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Paper elevation={3}>
              <Box component="form" id="login-form" onSubmit={handleSubmit} className="m-2 p-2" sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}>
                <Box className="text-center">Login</Box>
                <FormControl className="col-12 p-2" variant="standard">
                  <InputLabel className="ml-2 p-2" htmlFor="outlined-adornment-username">Username</InputLabel>
                  <Input
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    id="outlined-adornment-username"
                    type={'text'}
                    endAdornment={
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Box>
                  <FormControl className="col-12 p-2" variant="standard">
                    <InputLabel className="ml-2 p-2" htmlFor="outlined-adornment-password">Password</InputLabel>
                    <Input
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="start">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <ButtonGroup className="col-12 ms-auto p-2 justify-content-center align-items-center">
                  <Button type='submit' color='success'>Login</Button>
                  </ButtonGroup>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
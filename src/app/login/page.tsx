'use client'
import React from 'react'
import { Box, Button, ButtonGroup, FormControl, IconButton, Input, InputAdornment, InputLabel, Paper } from '@mui/material'
import { PersonOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { Slide, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import axios from 'axios';
import api from '../api';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = React.useState<LoginForm>({ username: '', password: '' })
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter()
  const cookies = useCookies()

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.status == 200) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user))
        router.push("/")
      }
    }).catch(error => {
      console.error(error)
      toast.error('Invalid Credentials', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    })
  }

  return (
    <Box className="container">
      <Box className="flex justify-content-center align-items-center" sx={{ height: '60vh' }}>
        <Box className="col-6 d-flex justify-content-center">
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Paper elevation={3}>
              <Box component={"form"} method='post' onSubmit={(e) => handleSubmit(e)}>
                <Box className="m-2 p-2" sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}>
                  <Box className="text-center">Login</Box>
                  <FormControl className="col-12 p-2" variant="standard">
                    <InputLabel className="ml-2 p-2" htmlFor="outlined-adornment-username">Username</InputLabel>
                    <Input
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
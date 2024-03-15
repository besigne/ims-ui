'use client'
import React from 'react'
import { User } from './interface'
import { Box, FormControl, InputLabel, Paper, Input, InputAdornment, IconButton, Button } from '@mui/material'
import { EmailOutlined, PersonOutline, Visibility, VisibilityOff } from '@mui/icons-material'

interface Component {
  user: User
}

interface Form {
  username: string,
  password: string,
  email: string
}

const UserForm: React.FC<Component> = ({ user }) => {
  const [form, setForm] = React.useState<Form>({ username: user.username, password: '', email: user.email });
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Paper className='col-3 d-flex justify-content-center align-items-center'>
      <Box className="col-12 p-2">
        <FormControl className="col-12 p-2" variant="standard">
          <InputLabel className="ml-2 p-2" htmlFor="outlined-adornment-username">Username</InputLabel>
          <Input
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            id="outlined-adornment-username"
            type={'text'}
            value={form.username}
            endAdornment={
              <InputAdornment position="start">
                <PersonOutline />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl className="col-12 p-2" variant="standard">
          <InputLabel className="ml-2 p-2" htmlFor="outlined-adornment-email">Email</InputLabel>
          <Input
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            id="outlined-adornment-email"
            type={'text'}
            value={form.email}
            endAdornment={
              <InputAdornment position="start">
                <EmailOutlined />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl className="col-12 p-2" variant="standard">
          <InputLabel className="ml-2 p-2" htmlFor="outlined-adornment-password">Password</InputLabel>
          <Input
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            endAdornment={
              <InputAdornment position="start">
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
              </InputAdornment>
            }
          />
        </FormControl>
        <Box className="d-flex p-2 justify-content-center align-items-center">
          <Button>Save Changes</Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default UserForm
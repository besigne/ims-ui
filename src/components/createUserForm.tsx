'use client'
import React from 'react'
import { EmailOutlined, ManageAccounts, ManageAccountsOutlined, PersonOutline, ToggleOffOutlined, ToggleOnOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControl, IconButton, Input, InputAdornment, InputLabel, Paper } from '@mui/material'
import { Slide, toast } from 'react-toastify'
import api from '@/app/api'

interface Component {
  closeModal: () => void
}

interface Form {
  username: string,
  password: string,
  email: string,
  is_staff: boolean,
  is_active: boolean
}

const CreateUserForm: React.FC<Component> = ({ closeModal }) => {
  const [form, setForm] = React.useState<Form>({ username: '', password: '', email: '', is_active: true, is_staff: false });
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    const token = sessionStorage.getItem('token');
    const userToast = toast.loading(`creating ${form.username}`, {
      position: "top-left",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    })

    await api.post('/admin/user/create/', form).then(response => {
      setTimeout(() => {
        toast.update(userToast, { render: `Created ${form.username} successfully`, type: "success", isLoading: false, autoClose: 2000 })
      }, 1000);
      closeModal()
    }).catch(error => {
      toast.update(userToast, { render: `Couldn't create ${form.username}`, type: "error", isLoading: false, autoClose: 4000 })
      Object.keys(error.response.data).forEach(key => {
        const errorMessages: string[] = error.response.data[key];
        errorMessages.forEach(errorMessage => {
          console.log(`${key}: ${errorMessage}`);
          toast.warn(`${key}: ${errorMessage}`, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide,
          });
        });
      });
    })
  }

  return (
    <Paper>
      <Paper elevation={3}>
        <Box sx={{ width: 400 }}>
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
            <FormControl className="col-12" variant="standard">
              <Box className="d-flex align-items-center">
                <Checkbox
                  value={form.is_active}
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  checked={form.is_active}
                  className="col-2"
                  icon={<ToggleOffOutlined />}
                  checkedIcon={<ToggleOnOutlined sx={{ color: "#fff" }} />}
                />
                <Button
                  color={form.is_active ? 'success' : 'error'}
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                >
                  Active
                </Button>
              </Box>
            </FormControl>
            <FormControl className="col-12" variant="standard">
              <Box className="d-flex align-items-center">
                <Checkbox
                  value={form.is_staff}
                  onClick={() => setForm({ ...form, is_staff: !form.is_staff })}
                  checked={form.is_staff}
                  className="col-2"
                  icon={<ManageAccountsOutlined />}
                  checkedIcon={<ManageAccounts sx={{ color: "#fff" }} />}
                />
                <Button
                  color={form.is_staff ? 'info' : 'error'}
                  onClick={() => setForm({ ...form, is_staff: !form.is_staff })}
                >
                  Administrator
                </Button>
              </Box>
            </FormControl>
            <Box className="d-flex p-2 justify-content-center align-items-center">
              <Button onClick={handleSubmit}>Create New User</Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Paper>
  )
}

export default CreateUserForm
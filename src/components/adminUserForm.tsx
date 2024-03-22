'use client'
import React from 'react'
import { EmailOutlined, ManageAccounts, PersonOutline, ToggleOffOutlined, ToggleOnOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Paper, Checkbox, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined';
import { Slide, toast } from 'react-toastify'
import { User } from './interface'
import api from '@/app/api';


interface Component {
  user: User,
  closeModal: () => void
}

interface Form {
  username: string,
  password: string,
  email: string,
  is_staff: boolean,
  is_active: boolean
}

const AdminUserForm: React.FC<Component> = ({ user, closeModal }) => {
  const [form, setForm] = React.useState<Form>({ username: user.username, password: '', email: user.email, is_active: user.is_active, is_staff: user.is_staff });
  const [showPassword, setShowPassword] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleDialog = () => {
    setOpenDialog(!openDialog)
  }

  const handleSubmit = async () => {
    const token = sessionStorage.getItem('token');
    const userToast = toast.loading('saving', {
      position: "top-left",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    })

    await api.put(`/admin/user/update/${user.id}/`, form).then(response => {
      toast.update(userToast, { render: `Saved ${form.username} successfully`, type: "success", isLoading: false, autoClose: 2000 })
      closeModal()
    }).catch(error => {
      toast.update(userToast, { render: `Couldn't update ${form.username}`, type: "warning", isLoading: false, autoClose: 2000 })
    })
  }

  const handleDeleteSubmit = async () => {
    const token = sessionStorage.getItem('token');
    const userToast = toast.loading('deleting', {
      position: "top-left",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    })

    await api.delete(`/admin/user/delete/${user.id}/`).then(response => {
      toast.update(userToast, { render: `Deleted ${form.username} successfully`, type: "success", isLoading: false, autoClose: 2000 })
      setOpenDialog(false)
      closeModal()
    }).catch(error => {
      toast.update(userToast, { render: `Couldn't delete ${form.username}`, type: "warning", isLoading: false, autoClose: 2000 })
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
                  color={form.is_active ? 'success' : 'inherit'}
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
                  color={form.is_staff ? 'success' : 'inherit'}
                  onClick={() => setForm({ ...form, is_staff: !form.is_staff })}
                >
                  Administrator
                </Button>
              </Box>
            </FormControl>
            <Box className="d-flex p-2 justify-content-center align-items-center">
              <Button color="error" onClick={handleDialog}>Delete User</Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Confirm to delete ${user.username}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            this action is not reversible
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleDialog}>No</Button>
          <Button color="error" onClick={handleDeleteSubmit} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default AdminUserForm
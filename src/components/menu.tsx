'use client'
import React from 'react'
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Slide, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { User } from './interface';
import axios from 'axios';

interface Component {
  user: User
}

const Menu: React.FC<Component> = ({ user }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    sessionStorage.clear();
    router.push("/login")
  }

  const docker = async () => {
    const tomcatToast = toast.loading('restarting', {
      position: "top-left",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    })

    const token = sessionStorage.getItem('token')

    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/restart`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      toast.update(tomcatToast, { render: `${response.data.message}`, type: 'success', isLoading: false, autoClose: 2000 });
    }).catch(error => {
      toast.update(tomcatToast, { render: 'Couldn\'t restart tomcat', type: 'warning', isLoading: false, autoClose: 2000 });
    })
  }

  return (
    <Box className="container">
      <Box className="d-flex flex-column">
        <Link href="/" underline="none" color={'white'}>
          <Paper elevation={2} className="m-2">
            <Typography className="p-3">Integration Management System</Typography>
          </Paper>
        </Link>
        <List className="p-3">
          <Paper elevation={1} className="m-2">
            <Link href="/user" underline="none" color={'white'}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <PersonOutlineOutlinedIcon sx={{ color: '#1890ff' }} />
                  </ListItemIcon>
                  <ListItemText primary={user.username} />
                </ListItemButton>
              </ListItem>
            </Link>
          </Paper>
          {user.is_staff ?
            <Paper elevation={1} className="m-2">
              <Link href="/admin" underline="none" color={'white'}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ManageAccountsOutlinedIcon sx={{ color: '#1890ff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Administrator" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Paper>
            : null}
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton disabled={true}>
                <ListItemIcon>
                  <UploadOutlinedIcon sx={{ color: '#1890ff' }} />
                </ListItemIcon>
                <ListItemText primary="Deploy" />
              </ListItemButton>
            </ListItem>
          </Paper>
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton onClick={docker}>
                <ListItemIcon>
                  <RestartAltOutlinedIcon sx={{ color: '#1890ff' }} />
                </ListItemIcon>
                <ListItemText primary="Restart Tomcat" />
              </ListItemButton>
            </ListItem>
          </Paper>
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <StorageOutlinedIcon sx={{ color: '#1890ff' }} />
                </ListItemIcon>
                <ListItemText primary="Database" />
              </ListItemButton>
            </ListItem>
          </Paper>
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HistoryOutlinedIcon sx={{ color: '#1890ff' }} />
                </ListItemIcon>
                <ListItemText primary="History" />
              </ListItemButton>
            </ListItem>
          </Paper>
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton onClick={handleClickOpen}>
                <ListItemIcon>
                  <LogoutOutlinedIcon sx={{ color: '#1890ff' }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </Paper>
        </List>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Logging out"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            this will disconnect you and turn off your tomcat instance
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={logout} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Menu
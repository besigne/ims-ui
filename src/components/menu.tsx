'use client'
import React from 'react'
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Divider } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Slide, toast } from 'react-toastify';
import { User } from './interface';
import { CodeOutlined, ContentCopy } from '@mui/icons-material';
import Loading from './loading';
import api from '@/app/api';

interface Component {
  user: User,
  logout: () => void
}

const Menu: React.FC<Component> = ({ user, logout }) => {
  const [open, setOpen] = React.useState(false);
  const [loadingCred, setLoadingCred] = React.useState(true);
  const [databaseUser, setDatabaseUser] = React.useState('');
  const [databasePwd, setDatabasePwd] = React.useState('');
  const [databaseDialog, setDatabaseDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDatabaseDialog = () => {
    if (!databaseDialog) {
      setLoadingCred(true)
      databaseCredentials()
    }
    setDatabaseDialog(!databaseDialog)
  }

  const copyToClipboard = (variable: string) => {
    navigator.clipboard.writeText(variable)
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

    await api.post('/restart/').then(response => {
      toast.update(tomcatToast, { render: `${response.data.message}`, type: 'success', isLoading: false, autoClose: 2000 });
    }).catch(error => {
      toast.update(tomcatToast, { render: 'Couldn\'t restart tomcat', type: 'warning', isLoading: false, autoClose: 2000 });
    })
  }

  const databaseCredentials = async () => {

    await api.get('/credentials/').then(response => {
      setDatabaseUser(response.data[0].user)
      setDatabasePwd(response.data[0].password)
      setLoadingCred(false)
    }).catch(error => {
      if (error.response.status === 403) {
        logout()
      }
    })
  }

  return (
    <Box className="container">
      <Box className="d-flex flex-column">
        <Link href="/" underline="none" color="inherit">
          <Paper elevation={2} className="m-2">
            <Typography className="p-3">Integration Management System</Typography>
          </Paper>
        </Link>
        <List className="p-3">
          <Paper elevation={1} className="m-2">
            <Link href="/user" underline="none" color="inherit">
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
              <Link href="/admin" underline="none" color="inherit">
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
            <Link href="/sql" underline='none' color={'white'}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <CodeOutlined sx={{ color: '#1890ff' }} />
                  </ListItemIcon>
                  <ListItemText primary="Edit SQL" />
                </ListItemButton>
              </ListItem>
            </Link>
          </Paper>
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton onClick={handleDatabaseDialog}>
                <ListItemIcon>
                  <StorageOutlinedIcon sx={{ color: '#1890ff' }} />
                </ListItemIcon>
                <ListItemText primary="Database" />
              </ListItemButton>
            </ListItem>
          </Paper>
          {/* <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HistoryOutlinedIcon sx={{ color: '#1890ff' }} />
                </ListItemIcon>
                <ListItemText primary="History" />
              </ListItemButton>
            </ListItem>
          </Paper> */}
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
      <Dialog
        open={databaseDialog}
        onClose={handleDatabaseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-database"
      >
        <DialogTitle id="alert-dialog-title">
          {"Database credentials"}
        </DialogTitle>
        {!loadingCred ?
          <DialogContent>
            <DialogContentText id="alert-dialog-database-username"
              className="d-flex align-items-center"
            >
              User: {databaseUser}
              <IconButton className="ml-auto" onClick={() => copyToClipboard(databaseUser)}>
                <ContentCopy />
              </IconButton>
            </DialogContentText>
            <Divider />
            <DialogContentText id="alert-dialog-database-password"
              className="d-flex align-items-center"
            >
              Pwd: {databasePwd}
              <IconButton className="ml-auto" onClick={() => copyToClipboard(databasePwd)}>
                <ContentCopy />
              </IconButton>
            </DialogContentText>
          </DialogContent> : <Loading />}
        <DialogActions>
          <Button onClick={handleDatabaseDialog} autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Menu
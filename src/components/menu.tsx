'use client'
import React from 'react'
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Divider, Accordion, AccordionSummary, MenuItem, Modal } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { CodeOutlined, ContentCopy } from '@mui/icons-material';
import { Slide, toast } from 'react-toastify';
import { VersionSideMenu } from './sidemenu';
import { UserInterface } from './interface';
import DockerFilled from '@/icons/docker';
import Loading from './loading';
import Cookies from 'js-cookie';
import api from '@/app/api';

interface Component {
  user: UserInterface,
  logout: () => void,
}

const Menu: React.FC<Component> = ({ user, logout }) => {
  const [isLogginOut, setIsLogginOut] = React.useState(false);
  const [loadingCred, setLoadingCred] = React.useState(true);
  const [databaseUser, setDatabaseUser] = React.useState('');
  const [databasePwd, setDatabasePwd] = React.useState('');
  const [databaseDialog, setDatabaseDialog] = React.useState(false);
  const [versionDrawer, setVersionDrawer] = React.useState(false);

  const handleVersionDrawer = () => {
    setVersionDrawer(!versionDrawer)
  }

  const handleClickLogout = () => {
    setIsLogginOut(!isLogginOut);
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
                    <PersonOutlineOutlinedIcon color="primary" />
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
                      <ManageAccountsOutlinedIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Administrator" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Paper>
            : null}
          {user.is_staff ?
            <Paper elevation={1} className="m-2">
              <Link href="/docker" underline="none" color="inherit">
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <DockerFilled color="#1890ff" />
                    </ListItemIcon>
                    <ListItemText primary="Docker" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Paper>
            : null}
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton onClick={handleVersionDrawer}>
                <ListItemIcon>
                  <UploadOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Versions" />
              </ListItemButton>
            </ListItem>
          </Paper>
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton onClick={docker}>
                <ListItemIcon>
                  <RestartAltOutlinedIcon color="primary" />
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
                    <CodeOutlined color="primary" />
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
                  <StorageOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Database" />
              </ListItemButton>
            </ListItem>
          </Paper>
          {/* <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HistoryOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="History" />
              </ListItemButton>
            </ListItem>
          </Paper> */}
          <Paper elevation={1} className="m-2">
            <ListItem disablePadding>
              <ListItemButton onClick={handleClickLogout}>
                <ListItemIcon>
                  <LogoutOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </Paper>
        </List>
      </Box>
      <Dialog
        open={isLogginOut}
        onClose={handleClickLogout}
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
          <Button onClick={handleClickLogout}>No</Button>
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
      <VersionSideMenu open={versionDrawer} handleChange={handleVersionDrawer} user={user} logout={logout} />
    </Box>
  )
}

export default Menu
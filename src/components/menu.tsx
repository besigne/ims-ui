'use client'
import React from 'react'
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, Paper } from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface Component {
  username: string
}

const Menu: React.FC<Component> = ({ username }) => {
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
            <Link href="/v1/user" underline="none" color={'white'}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <PersonOutlineOutlinedIcon sx={{ color: '#1890ff' }} />
                  </ListItemIcon>
                  <ListItemText primary={username} />
                </ListItemButton>
              </ListItem>
            </Link>
          </Paper>
          <Paper elevation={1} className="m-2">
            <Link href="/v1/admin" underline="none" color={'white'}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ManageAccountsOutlinedIcon sx={{ color: '#1890ff' }} />
                  </ListItemIcon>
                  <ListItemText primary="Management" />
                </ListItemButton>
              </ListItem>
            </Link>
          </Paper>
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
              <ListItemButton>
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
              <ListItemButton>
                <ListItemIcon>
                  <LogoutOutlinedIcon sx={{ color: '#1890ff' }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </Paper>
        </List>
      </Box>
    </Box>
  )
}

export default Menu
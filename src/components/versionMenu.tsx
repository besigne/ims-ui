'use client'
import React from 'react'
import { UserInterface } from './interface'
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import api from '@/app/api';
import Loading from './loading';
import { AttachFileOutlined } from '@mui/icons-material';
import { Slide, toast } from 'react-toastify';

interface Component {
  user: UserInterface;
}

interface FileList {
  id: number,
  filename: string,
}

const VersionMenu: React.FC<Component> = ({ user }) => {
  const [files, setFiles] = React.useState<FileList[]>([])
  const [loading, setLoading] = React.useState(false);
  const [deplying, setDeploying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    getFiles()
    if (files.length != 0) {
      setLoading(false)
    }
  }, [files.length != 0])

  const getFiles = async () => {
    setLoading(true)
    await api.get("/files/").then(response => {
      if (response.data.filelist) {
        setFiles([])
        Object.keys(response.data.filelist).forEach(key => {
          setFiles(prev => [...prev, response.data.filelist[key]])
        })
      }
    }).catch(error => {
      console.error(error)
    })
  }

  const deploy = async (name: string) => {

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${user.first_name}/`)
    const deployToast = toast.loading('starting', {
      position: "top-left",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: progress,
      theme: "dark",
      transition: Slide,
    })
    const formData = new FormData();
    formData.append('filename', name)

    socket.onopen = () => {
      setDeploying(true)
    }

    socket.onmessage = (event) => {
      const progress = JSON.parse(event.data)
      setProgress(progress.percentage)
      toast.update(deployToast, { render: `${progress.message}`, isLoading: true, autoClose: 2000 });
    }

    socket.onclose = () => {
      toast.update(deployToast, { render: "finish", type: "success", isLoading: false, autoClose: 2000 });
      setDeploying(false)
    }

    api.post('/deploy/', formData).then(response => {
      socket.close()
    }).catch(error => {
      console.error(error)
    })
  }

  return (
    <Box className="container">
      <Box className="d-flex flex-column">
        <Paper elevation={2} className="d-flex m-2 align-items-center justify-content-center">
          <Typography className="p-3">Version List</Typography>
        </Paper>
        {!loading ? files.map(file => (
          <Paper elevation={1} className="m-2" key={file.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => deploy(file.filename)} disabled={deplying}>
                  <ListItemIcon>
                    <AttachFileOutlined color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={file.filename} />
                </ListItemButton>
              </ListItem>
          </Paper>
        )) : <Loading />}
      </Box>
    </Box>
  )
}

export default VersionMenu
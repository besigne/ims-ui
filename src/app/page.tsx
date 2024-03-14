'use client'
import React from 'react'
import { Box, Button, LinearProgress, Paper, TextField, Typography } from '@mui/material'
import { CloudUploadOutlined } from '@mui/icons-material';
import { VisuallyHiddenInput } from '@/components/helper';
import { convertUser, verify } from '@/components/functions';
import { User } from '@/components/interface';
import Loading from '@/components/loading';
import Bar from '@/components/bar';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';

export default function Home() {
  const [user, setUser] = React.useState<User>({ id: 0, username: '', first_name: '', is_staff: false, is_active: false, last_login: '', date_joined: '' })
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [streamLog, setStreamLog] = React.useState('');
  const [isDeploying, setIsDeploying] = React.useState(false);
  const textFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    verify()
    setUser(convertUser())
    setToken(sessionStorage.getItem('token'))
    if (user.id != 0) {
      setLoading(false)
      handleSocket(user.id, user.first_name)
    }
  }, [user.id != 0])

  React.useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.scrollTop = textFieldRef.current.scrollHeight;
    }
  }, [streamLog])

  const handleSocket = (userId: number, username: string) => {
    const tomcatStreamLogReader = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}logs/${username}/${userId}/`)

    tomcatStreamLogReader.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.line && typeof (data.line) == 'string') {
        setStreamLog(stream => stream + data.line)
      }
    }
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    handleUpload(file, file.name);
  }

  const handleUpload = async (file: File, filename: string) => {

    const formData = new FormData();
    formData.append('file_attachment', file)

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.status == 201) {
        deploy(filename)
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
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    })
    const formData = new FormData();
    formData.append('filename', name)

    socket.onopen = () => {
      setIsDeploying(true)
    }

    socket.onmessage = (event) => {
      const progress = JSON.parse(event.data)
      toast.update(deployToast, {render: `${progress.message}`, isLoading: true, autoClose: 2000});
    }

    socket.onclose = () => {
      setIsDeploying(false)
      toast.update(deployToast, {render: "finish", type: "success", isLoading: false, autoClose: 2000});
    }

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/deploy`, formData, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      socket.close()
    })
  }

  return (
    <>
      {!loading ?
        <Box className="container">
          <Bar title={'Integration Management System'} user={user.username} />
          <Box className="m-2 p-2 d-flex justify-content-center">
            <Box className="col-6 d-flex justify-content-center">
              <Paper elevation={3}>
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  startIcon={<CloudUploadOutlined />}
                >
                  Upload Zip
                  <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>
              </Paper>
            </Box>
          </Box>
          <Box className="m-4 p-2 d-flex justify-content-center align-items-center">
            <Paper elevation={3}>
              <Typography className="col ms-auto p-2">Tomcat Logs</Typography>
            </Paper>
          </Box>
          <Box className="m-4 p-2 d-flex justify-content-center">
            <Paper className='col-12 d-flex justify-content-center align-items-center'>
              <Box className="col-11">
                <TextField
                  inputRef={textFieldRef}
                  fullWidth
                  multiline
                  disabled={true}
                  rows={30}
                  defaultValue={streamLog}
                  variant="standard"
                />
              </Box>
            </Paper>
          </Box>
        </Box>
        :
        <Loading />
      }
    </>
  );
}

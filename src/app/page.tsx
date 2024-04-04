'use client'
import React from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { CloudUploadOutlined } from '@mui/icons-material';
import { VisuallyHiddenInput } from '@/components/helper';
import { convertUser } from '@/components/functions';
import { Slide, toast } from 'react-toastify';
import { UserInterface } from '@/components/interface';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import Bar from '@/components/bar';
import api from './api';

export default function Home() {
  const [user, setUser] = React.useState<UserInterface>({ id: 0, username: '', first_name: '', email: '', is_staff: false, is_active: false, last_login: '', date_joined: '', container_port: '' })
  const [loading, setLoading] = React.useState(true);
  const [token, setToken] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [streamLog, setStreamLog] = React.useState('');
  const textFieldRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    setUser(convertUser())
    fetchToken()
    if (user.id != 0) {
      setLoading(false)
      handleSocket(user.id, user.first_name)
      auth()
    }
  }, [user.id != 0, token != ''])

  const auth = async () => {
    await api.get('/auth/').then(response => {
    }).catch(error => {
      console.error(error)
      logout(user.username, true)
      window.location.reload
    })
  }

  const fetchToken = () => {
    let token = ''
    while (token = '') {
      if (typeof window !== 'undefined') {
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';');
          for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
              token = value;
            }
          }
        }
      }
    }
    setToken(token)
  }

  const logout = (username: string, timedout?: boolean) => {
    api.get("/logout/")
    sessionStorage.clear();
    router.push("/login");
    const message = timedout == true ? 'Session expired' : `Goodbye ${username}`;
    toast(message, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    });
  }

  React.useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.scrollTop = textFieldRef.current.scrollHeight;
    }
  }, [streamLog])

  const handleSocket = (userId: number, username: string) => {
    const tomcatStreamLogReader = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}logs/${username}/${userId}/`)

    tomcatStreamLogReader.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.full_log) {
        setStreamLog(stream => stream + data.full_log)
      }
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

    await api.post('/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => {
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
      pauseOnHover: false,
      draggable: true,
      progress: progress,
      theme: "dark",
      transition: Slide,
    })
    const formData = new FormData();
    formData.append('filename', name)

    socket.onopen = () => {

    }

    socket.onmessage = (event) => {
      const progress = JSON.parse(event.data)
      setProgress(progress.percentage)
      toast.update(deployToast, { render: `${progress.message}`, isLoading: true, autoClose: 2000 });
    }

    socket.onclose = () => {
      toast.update(deployToast, { render: "finish", type: "success", isLoading: false, autoClose: 2000 });
    }

    api.post('/deploy/', formData, { headers: { 'X-CRSFToken': token } }).then(response => {
      socket.close()
    }).catch(error => {
      console.error(error)
    })
  }

  return (
    <>
      {!loading ?
        <Box className="container">
          <Bar title={'Integration Management System'} user={user} logout={() => logout(user.first_name)} token={token} />
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

'use client'
import React from 'react'
import { UserInterface } from '@/components/interface';
import { convertUser } from '@/components/functions';
import { dockerColumns } from '@/components/helper';
import { Slide, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Box, Paper } from '@mui/material'
import Loading from '@/components/loading';
import { DataGrid } from '@mui/x-data-grid';
import Bar from '@/components/bar'
import api from '../api';

interface Containers {
  id: string,
  key: number,
  name: string,
  stauts: string
}

export default function Docker() {
  const [user, setUser] = React.useState<UserInterface>({ id: 0, username: '', first_name: '', is_staff: false, email: '', is_active: false, last_login: '', date_joined: '', container_port: '' });
  const [loading, setLoading] = React.useState(true);
  const [containers, setContainers] = React.useState<Containers[]>([]);
  const [containersLoading, setContainersLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setUser(convertUser())
    if (user.id != 0) {
      setLoading(false);
      fetchContainerList()
      auth()
    }
  }, [user.id != 0])

  const auth = async () => {
    await api.get('/auth/').then(response => {
      setLoading(false);
    }).catch(error => {
      console.error(error)
      logout(user.username, true)
      window.location.reload
    })
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

  const fetchContainerList = async () => {
    setContainersLoading(true)
    await api.get('/docker/list/').then(response => {
      if (response.data.containers) {
        Object.keys(response.data.containers).forEach(key => {
          setContainers(containers => [...containers, response.data.containers[key]])
        })
      }
    }).catch(error => {
      console.error(error)
    })
    setContainersLoading(false);
  }

  const handleActions = async (e: any) => {
    let url = ''
    if (e.field === 'actions') {
      setContainersLoading(true)
      if (e.row.status === 'exited') {
        url = 'start'
      } else {
        url = 'stop'
      }
      await api.post(`/docker/${url}/${e.row.id}/`).then(response => {
        console.log(response)
        setContainers([])
        fetchContainerList()
      }).catch(error => {
        console.error(error)
      })
    }
  }

  return (
    <>
      {!loading ?
        <Box className="container">
          <Bar title={'Docker overview'} user={user} logout={() => logout(user.first_name)} />
          <Paper className="m-2 p-2 d-flex justify-content-center">
            {!containersLoading ?
              < DataGrid
                rows={containers}
                columns={dockerColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 }
                  }
                }}
                onCellClick={(e) => handleActions(e)}
                pageSizeOptions={[5, 10, 15]}
                showCellVerticalBorder={false}
                rowSelection={false}
              />
              : <Loading />}
          </Paper>
        </Box>
        : <Loading />}
    </>
  )
}
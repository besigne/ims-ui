'use client'
import React from 'react'
import { Box, Button, Modal, Paper } from '@mui/material'
import { convertGridUser, convertUser } from '@/components/functions';
import { DataGrid, GridCellParams, GridPagination } from '@mui/x-data-grid';
import CreateUserForm from '@/components/createUserForm';
import { PersonAddOutlined } from '@mui/icons-material';
import AdminUserForm from '@/components/adminUserForm';
import { columns } from '@/components/helper';
import { User } from '@/components/interface';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import Bar from '@/components/bar';
import api from '../api';
import { Slide, toast } from 'react-toastify';

interface UserData {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  last_login: string;
  date_joined: string;
}

export default function Admin() {
  const [user, setUser] = React.useState<User>({ id: 0, username: '', first_name: '', is_staff: false, email: '', is_active: false, last_login: '', date_joined: '', container_port: '' })
  const [selectedUser, setSelectedUser] = React.useState<User>({ id: 0, username: '', first_name: '', is_staff: false, email: '', is_active: false, last_login: '', date_joined: '', container_port: '' });
  const [loading, setLoading] = React.useState(true);
  const [row, setRow] = React.useState<UserData[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setUser(convertUser())
    if (user.id != 0) {
      auth()
      userList()
    }
  }, [user.id != 0])

  const auth = async () => {
    await api.get('/auth/').then(response => {
      setLoading(false)
    }).catch(error => {
      logout(user.username, true)
      window.location.reload
    })
  }

  const userList = async () => {

    await api.get(`/admin/user/`).then(response => {
      if (response.data.result) {
        Object.keys(response.data.result).forEach(key => {
          setRow(row => [...row, response.data.result[key]])
        })
      }
    })
  }

  const handleUserModal = () => {
    if (isModalOpen) reloadTable();
    setIsModalOpen(!isModalOpen)
  }

  const handleCreateModal = () => {
    if (isCreateOpen) reloadTable();
    setIsCreateOpen(!isCreateOpen);
  }

  const handleUser = (e: GridCellParams) => {
    setSelectedUser(convertGridUser(e))
  }

  const reloadTable = () => {
    setRow([])
    userList()
  }

  const logout = (username: string, timedout?: boolean) => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${username}/`)
    socket.close();
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

  return (
    <>
      {!loading ?
        <Box className="container">
          <Modal
            open={isModalOpen}
            onClose={handleUserModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box className="m-4 p-2 d-flex justify-content-center">
              <AdminUserForm user={selectedUser} closeModal={() => handleUserModal()} />
            </Box>
          </Modal>
          <Modal
            open={isCreateOpen}
            onClose={handleCreateModal}
          >
            <Box className="m-4 p-2 d-flex justify-content-center">
              <CreateUserForm closeModal={() => handleCreateModal()} />
            </Box>
          </Modal>
          <Bar title={'Administrator settings'} user={user} logout={() => logout(user.first_name)} />
          <Paper className='m-4 p-2 d-flex justify-content-center align-items-center'>
            <DataGrid
              rows={row}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 }
                }
              }}
              pageSizeOptions={[5, 10]}
              onCellDoubleClick={handleUserModal}
              onCellClick={(e) => handleUser(e)}
              showCellVerticalBorder={false}
              rowSelection={false}
              slots={{
                footer: () => (
                  <>
                    <Box className="d-flex align-items-center">
                      <Box className="col p-2">
                        <Button
                          onClick={handleCreateModal}
                          color="success"
                          startIcon={<PersonAddOutlined />}>
                          New User
                        </Button>
                      </Box>
                      <GridPagination className="col" />
                    </Box>
                  </>
                )
              }}
            />
          </Paper>
        </Box>
        :
        <Loading />
      }
    </>
  );
}

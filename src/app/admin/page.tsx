'use client'
import React from 'react'
import { Box, Button, Modal, Paper } from '@mui/material'
import { convertGridUser, convertUser, verify } from '@/components/functions';
import { DataGrid, GridCellParams, GridPagination } from '@mui/x-data-grid';
import CreateUserForm from '@/components/createUserForm';
import { PersonAddOutlined } from '@mui/icons-material';
import AdminUserForm from '@/components/adminUserForm';
import { columns } from '@/components/helper';
import { User } from '@/components/interface';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import Bar from '@/components/bar';
import axios from 'axios';
// import api, { postData } from '../api';

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
  const [user, setUser] = React.useState<User>({ id: 0, username: '', first_name: '', is_staff: false, email: '', is_active: false, last_login: '', date_joined: '' })
  const [selectedUser, setSelectedUser] = React.useState<User>({ id: 0, username: '', first_name: '', is_staff: false, email: '', is_active: false, last_login: '', date_joined: '' });
  const [loading, setLoading] = React.useState(true);
  const [row, setRow] = React.useState<UserData[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    verify()
    setUser(convertUser())
    if (user.id != 0) {
      setLoading(false)
      userList()
    }
  }, [user.id != 0])

  const userList = async () => {

    // await api.get(`/admin/user/`).then(response => {
    //   if (response.data.users) {
    //     Object.keys(response.data.users).forEach(key => {
    //       setRow(row => [...row, response.data.users[key]])
    //     })
    //   }
    // })
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

  const logout = (username: string) => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${username}/`)
    socket.close()
    sessionStorage.clear()
    router.push('/login')
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
              <AdminUserForm user={selectedUser} />
            </Box>
          </Modal>
          <Modal
            open={isCreateOpen}
            onClose={handleCreateModal}
          >
            <Box className="m-4 p-2 d-flex justify-content-center">
              <CreateUserForm />
            </Box>
          </Modal>
          <Bar title={'Administrator settings'} user={user} logout={() => logout(user.first_name)} />
          <Box className="m-4 p-2 d-flex justify-content-center">
            <Paper className='col-9 d-flex justify-content-center align-items-center'>
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
        </Box>
        :
        <Loading />
      }
    </>
  );
}

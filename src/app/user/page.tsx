'use client'
import React from 'react'
import { convertUser } from '@/components/functions';
import { UserInterface } from '@/components/interface';
import { Slide, toast } from 'react-toastify';
import UserForm from '@/components/userForm';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import { Box } from '@mui/material'
import Bar from '@/components/bar';
import api from '../api';

export default function User() {
  const [user, setUser] = React.useState<UserInterface>({ id: 0, username: '', first_name: '', email: '', is_staff: false, is_active: false, last_login: '', date_joined: '', container_port: '' })
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    setUser(convertUser())
    if (user.id != 0) {
      auth()
    }
  }, [user.id != 0])

  const auth = async () => {
    await api.get('/auth/').then(response => {
      setLoading(false)
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

  return (
    <>
      {!loading ?
        <Box className="container">
          <Bar title={'User settings'} user={user} logout={() => logout(user.first_name)} />
          <Box className="m-4 p-2 d-flex justify-content-center">
            <UserForm user={user} />
          </Box>
        </Box>
        :
        <Loading />
      }
    </>
  );
}

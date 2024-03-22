'use client'
import React from 'react'
import { convertUser } from '@/components/functions';
import { User } from '@/components/interface';
import { useRouter } from 'next/navigation';
import Bar from '@/components/bar';
import api from '../api';
import { Slide, toast } from 'react-toastify';
import Loading from '@/components/loading';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import { CustomTabPanel, allyProps } from '@/components/sqlTab';
import SQLCodeEditor from '@/components/codeEditor';


export default function Sql() {
  const [user, setUser] = React.useState<User>({ id: 0, username: '', first_name: '', email: '', is_staff: false, is_active: false, last_login: '', date_joined: '' })
  const [loading, setLoading] = React.useState(true);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [dataSQL, setDataSQL] = React.useState('');
  const [structureSQL, setStructureSQL] = React.useState('');
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    setUser(convertUser())
    if (user.id != 0) {
      auth()
      fetchData()
    }
  }, [user.id != 0])

  const auth = async () => {
    await api.get('/auth/').then(response => {
      setLoading(false)
    }).catch(error => {
      if (error.response.status === 403) {
        logout(user.username, true)
      }
    })
  }

  const logout = (username: string, timedout?: boolean) => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${username}/`)
    socket.close();
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

  const fetchData = async () => [
    await api.get('/sql/data/').then(response => {
      setDataSQL(response.data.content)
      setDataLoading(false)
    }).catch(error => {
      console.error(error)
    }),
    await api.get('/sql/structure/').then(response => {
      setStructureSQL(response.data.content)
    }).catch(error => {
      console.error(error)
    })
  ]

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }

  const handleDataSqlChange = (value: string | undefined) => {
    if (value) {
      setDataSQL(value);
    }
  };

  return (
    <>
      {!loading ?
        <Box className="container">
          <Bar title={"SQL Editor"} user={user} logout={() => logout(user.first_name)} />
          <Box className="m-4 p-2 d-flex justify-content-center">
            <Paper className='col-12 d-flex justify-content-center align-items-center'>
              <Box className="col-11">
                {!dataLoading ?
                  <>
                    <Tabs value={value} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                      <Tab label={'Data.sql'} key={0} {...allyProps(0)} />
                      <Tab label={'Structure.sql'} key={1} {...allyProps(1)} />
                    </Tabs>
                    <CustomTabPanel value={value} index={0} key={0}>
                        <SQLCodeEditor defaultValue={dataSQL} onChange={handleDataSqlChange}/>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1} key={1}>
                      <Box>
                        {structureSQL}
                      </Box>
                    </CustomTabPanel>
                  </>
                  : <Loading />}
              </Box>
            </Paper>
          </Box>
        </Box>
        :
        <Loading />}
    </>
  )
}
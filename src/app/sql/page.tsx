'use client'
import React from 'react'
import { convertUser } from '@/components/functions';
import { CustomTabPanel, allyProps } from '@/components/sqlTab';
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import SQLCodeEditor from '@/components/codeEditor';
import { FastRewindOutlined, SaveOutlined } from '@mui/icons-material';
import { User } from '@/components/interface';
import { Slide, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import Bar from '@/components/bar';
import api from '../api';

interface FileSelect {
  data: boolean,
  structure: boolean
}

export default function Sql() {
  const [user, setUser] = React.useState<User>({ id: 0, username: '', first_name: '', email: '', is_staff: false, is_active: false, last_login: '', date_joined: '', container_port: '' })
  const [loading, setLoading] = React.useState(true);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [dataSQL, setDataSQL] = React.useState('');
  const [structureSQL, setStructureSQL] = React.useState('');
  const [fileForm, setFileForm] = React.useState<FileSelect>({ data: true, structure: false })
  const [resetSqlDialog, setResetSqlDialog] = React.useState(false);
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

  const handleStructureSqlChange = (value: string | undefined) => {
    if (value) {
      setStructureSQL(value);
    }
  }

  const handleResetDialog = () => {
    setResetSqlDialog(!resetSqlDialog)
  }

  const handleSubmit = async () => {
    const submitSqlToast = toast.loading(`saving ${fileForm.data ? 'data.sql' : 'structure.sql'}`, {
      position: "top-left",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    })


    const url = fileForm.data ? '/sql/data/' : '/sql/structure/';
    const formData = new FormData();
    fileForm.data ? formData.append('data', dataSQL) : formData.append('structure', structureSQL);

    await api.put(url, formData).then(response => {
      setDataLoading(true)
      fetchData()
      toast.update(submitSqlToast, { render: `saved ${fileForm.data ? 'data.sql' : 'structure.sql'}`, isLoading: false, autoClose: 2000, type: "success" })
    }).catch(error => {
      console.error(error)
    })
  }

  const handleResetSubmit = async () => {
    setResetSqlDialog(false)
    await api.post('/sql/reset/', fileForm).then(response => {
      setDataLoading(true)
      fetchData()
    }).catch(error => {
      console.error(error)
    })
  }

  return (
    <>
      {!loading ?
        <Box className="container">
          <Bar title={"SQL Editor"} user={user} logout={() => logout(user.first_name)} />

          <Box className="p-2 d-flex justify-content-center">
            <Paper className='col-12 d-flex justify-content-center align-items-center'>

              <Box className="col-11">
                {!dataLoading ?
                  <>
                    <Tabs value={value} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                      <Tab label={'Data.sql'} key={0} {...allyProps(0)} onClick={() => setFileForm({ data: true, structure: false })} />
                      <Tab label={'Structure.sql'} key={1} {...allyProps(1)} onClick={() => setFileForm({ data: false, structure: true })} />
                    </Tabs>
                    <CustomTabPanel value={value} index={0} key={0}>
                      <SQLCodeEditor defaultValue={dataSQL} onChange={handleDataSqlChange} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1} key={1}>
                      <Box>
                        <SQLCodeEditor defaultValue={structureSQL} onChange={handleStructureSqlChange} />
                      </Box>
                    </CustomTabPanel>
                    <Divider />
                    <Box className="p-2 d-flex justify-content-end align-content-center">
                      <ButtonGroup>
                        <Button
                          onClick={handleResetDialog}
                          startIcon={<FastRewindOutlined />}
                        >
                          Reset SQL
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          startIcon={<SaveOutlined />}
                        >
                          Save Changes
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </>
                  : <Loading />}
              </Box>
            </Paper>
          </Box>
          <Dialog
            open={resetSqlDialog}
            onClose={handleResetDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-database"
          >
            <DialogTitle id="alert-dialog-title">
              Reset {value === 0 ? 'data.sql' : 'structure.sql'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-database-username"
                className="d-flex align-items-center">
                This action will reset your {value === 0 ? 'data.sql' : 'structure.sql'} to default.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleResetDialog}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetSubmit}
                color="warning"
                autoFocus
              >
                Yes I'm aware
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        :
        <Loading />}
    </>
  )
}
'use client'
import React from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import Bar from '@/components/bar';
import { CloudUploadOutlined } from '@mui/icons-material';
import { VisuallyHiddenInput } from '@/components/helper';

export default function Home() {

  return (
    <>
      <Box className="container">
        <Bar title={'Integration Management System'} />
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
                <VisuallyHiddenInput type="file" />
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
                fullWidth
                multiline
                disabled={true}
                rows={30}
                defaultValue="stream log here"
                variant="standard"
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}

'use client'
import { Box, CircularProgress } from "@mui/material"

const Loading: React.FC = () => {

  return (
    <Box className="container">
      <Box className="flex justify-content-center align-items-center" sx={{ height: '60vh' }}>
        <Box className="col-6 d-flex justify-content-center" sx={{ color: 'white' }}>
          <CircularProgress color="inherit" />
        </Box>
      </Box>
    </Box>

  )
}

export default Loading
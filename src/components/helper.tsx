import { styled } from '@mui/material/styles';
import { GridColDef } from '@mui/x-data-grid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Button } from '@mui/material';
import { Circle } from '@mui/icons-material';

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const columns: readonly GridColDef[] = [
  { field: 'username', headerName: 'Username', sortable: false, flex: 3, disableColumnMenu: true },
  { field: 'email', headerName: 'Email', sortable: false, flex: 4, disableColumnMenu: true },
  {
    field: 'is_staff',
    headerName: 'Administrator',
    sortable: false,
    flex: 3,
    disableColumnMenu: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      if (params.value) {
        return <CheckCircleOutlineIcon />
      } else {
        return <RadioButtonUncheckedIcon />
      }
    }
  },
  {
    field: 'is_active',
    headerName: 'Active',
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    flex: 2,
    disableColumnMenu: true,
    renderCell: (params) => {
      if (params.value) {
        return <CheckCircleOutlineIcon />
      } else {
        return <RadioButtonUncheckedIcon />
      }
    }
  },
  {
    field: 'date_joined',
    headerName: 'Date Joined',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    flex: 3,
    disableColumnMenu: true
  },
  {
    field: 'last_login',
    headerName: 'Last Login',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    flex: 3,
    disableColumnMenu: true
  }
]

export const dockerColumns: readonly GridColDef[] = [
  { field: 'id', headerName: 'Container ID', sortable: false, flex: 1, disableColumnMenu: true },
  { field: 'name', headerName: 'Name', sortable: false, flex: 5, disableColumnMenu: true },
  {
    field: 'status',
    headerName: 'Status',
    sortable: false,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      if (params.value === "exited") {
        return <Circle sx={{ color: '#f44336' }} />
      } else {
        return <Circle sx={{ color: '#4caf50' }} />
      }
    }
  },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    disableColumnMenu: true,
    renderCell: (params) => {
      if (params.row.status === "exited") {
        return (
          <Button
            variant="text"
            color="success"
          >
            Start
          </Button>
        )
      } else {
        return (
          <Button
            variant="text"
            color="error"
          >
            Stop
          </Button>
        )
      }
    },
  }
]
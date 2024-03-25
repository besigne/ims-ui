import { styled } from '@mui/material/styles';
import { GridColDef } from '@mui/x-data-grid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

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

interface Column {
  id: 'username' | 'email' | 'date_joined' | 'last_login';
  label: string;
  flex?: number;
  align?: 'right';
}

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
import { UserInterface } from './interface';

export const convertUser = () => {
  const stored = sessionStorage.getItem('user');
  if (stored) {
    const storedUser: Partial<UserInterface> = JSON.parse(stored);
    if (validateUser(storedUser)) {
      const user: UserInterface = storedUser as UserInterface;
      return user;
    }
  }
  const user: UserInterface = { id: 0, username: '', first_name: '', is_staff: false, email: '', is_active: false, last_login: '', date_joined: '', container_port: '' }
  return user;
}

export const convertGridUser = (cell: any) => {
  if (validateGridUser(cell.row)) {
    const user: UserInterface = cell.row as UserInterface;
    return user;
  } else {
    const user: UserInterface = { id: 0, username: '', first_name: '', is_staff: false, email: '', is_active: false, last_login: '', date_joined: '', container_port: '' }
    return user;
  }
}


function validateUser(obj: any): obj is UserInterface {
  return (
    typeof obj.id === 'number' &&
    typeof obj.username === 'string' &&
    typeof obj.first_name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.is_staff === 'boolean' &&
    typeof obj.is_active === 'boolean' &&
    typeof obj.last_login === 'string' &&
    typeof obj.date_joined === 'string' &&
    typeof obj.container_port === 'string'
  )
}

function validateGridUser(obj: any): obj is UserInterface {
  return (
    typeof obj.username === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.is_staff === 'boolean' &&
    typeof obj.is_active === 'boolean' &&
    typeof obj.last_login === 'string' &&
    typeof obj.date_joined === 'string' &&
    typeof obj.container_port === 'string'
  )
}
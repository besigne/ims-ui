import { redirect } from 'next/navigation';
import { User } from './interface';

export const verify = () => {
  const token = sessionStorage.getItem('token')
  if (!token) {
    redirect('/login');
  }
}

export const convertUser = () => {
  const stored = sessionStorage.getItem('user');
  if (stored) {
    const storedUser: Partial<User> = JSON.parse(stored);
    if (validateUser(storedUser)) {
      const user: User = storedUser as User;
      return user;
    }
  }
  const user: User = { id: 0, username: '', first_name: '', is_staff: false, is_active: false, last_login: '', date_joined: '' }
  return user;

}

function validateUser(obj: any): obj is User {
  return (
    typeof obj.id === 'number' &&
    typeof obj.username === 'string' &&
    typeof obj.first_name === 'string' &&
    typeof obj.is_staff === 'boolean' &&
    typeof obj.is_active === 'boolean' &&
    typeof obj.last_login === 'string' &&
    typeof obj.date_joined === 'string'
  )
}
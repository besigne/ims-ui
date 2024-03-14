import { redirect } from 'next/navigation';

export const verify = () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
        redirect('/login');
    } else {
        redirect('/')
    }
}
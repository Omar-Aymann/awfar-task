import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Base URL for your API
    headers: {
    },
  });
export const updateUserInfo = async (userData: { name: string; email: string; password: string }) => {
    const token = localStorage.getItem('token'); 

  const response = await api.put('/user', 
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; 
};
export const getUserInfo = async () => {
const token = localStorage.getItem('token'); 

    const response = await api.get('/user', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

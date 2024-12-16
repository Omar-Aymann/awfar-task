import axios, { AxiosResponse } from 'axios';

// Define the Task type
export interface Task {
  _id: string;
  name: string;
  isCompleted: boolean;
}

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Base URL for your API
  headers: {
  },
});

// Add request interceptor to set Authorization header if the token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`; // Attach token to every request
  }
  return config;
}, (error) => {
  // Handle any errors in the request setup
  return Promise.reject(error);
});


// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    if (error.response?.status === 401) {
      // If 401 Unauthorized, clear localStorage and redirect to login
      localStorage.clear();
      window.location.href = '/login'; // Replace with your login route
    }
    return Promise.reject(error); // Forward the error for further handling
  }
);


// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
   setTimeout(() => {}, 1000);
  const response: AxiosResponse<Task[]> = await api.get('/tasks');
  return response.data;
};

// Create a new task
export const createTask = async (taskName: string): Promise<Task[]> => {
  const response: AxiosResponse<Task[]> = await api.post('/tasks', { name: taskName });
  return response.data;
};

// Update a task (e.g., toggle status or edit task name)
export const updateTask = async (taskId: string, updatedData: Partial<Task>): Promise<Task> => {
  const response: AxiosResponse<Task> = await api.put(`/tasks/${taskId}`, updatedData);
  return response.data;
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  const response: AxiosResponse =  await api.delete(`/tasks/${taskId}`);
  return response.data;};

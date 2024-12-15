import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginFormValues {
  email: string;
  password: string;
}
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useMutation(
    async (data: LoginFormValues) => {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/auth/login', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        message.success('Login successful!');
        navigate('/tasks');
      },
      onError: (error: unknown) => {
  // First, check if the error is an AxiosError
  if (axios.isAxiosError(error)) {
    // Access error properties after checking the type
    message.error(error.response?.data?.message || 'An unknown error occurred.');
  } else {
    // Handle unexpected errors
    message.error('An error occurred.');
  }
      }

    }
  )
  const onFinish = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h1 className='text-2xl'>Login to see your Tasks</h1>
      <Form
        name="loginForm"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;

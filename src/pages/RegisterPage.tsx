import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Mutation for registering the user
  const registerMutation = useMutation(
    async (data: RegisterFormValues) => {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/auth/register', data);
      return response.data;
    },
    {
      onSuccess: () => {
        message.success('Registration successful!');
        navigate('/login'); // Redirect to login page after successful registration
      },
      onError: (error: unknown) => {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data?.message || 'An unknown error occurred.');
        } else {
          message.error('An error occurred.');
        }
      }
    }
  );

  // Handle form submission
  const onFinish = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h1 className='text-2xl'>Register to Create an Account</h1>
      <Form
        name="registerForm"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Name Field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        {/* Email Field */}
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

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter your password!' },
            { min: 6, message: 'Password must be at least 6 characters long!' },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={registerMutation.isLoading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;

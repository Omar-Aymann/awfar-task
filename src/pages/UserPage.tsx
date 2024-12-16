import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useQuery, useMutation } from 'react-query';
import { getUserInfo, updateUserInfo } from '../utils/users'; // Your API functions

const UserProfileForm: React.FC = () => {
  const [form] = Form.useForm();

  const {  isLoading, isError, error } = useQuery('userInfo', getUserInfo, {
    onSuccess: (data) => {
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        password: '', 
      });
    },
  });

  // Mutation to update user info
  const updateMutation = useMutation(updateUserInfo, {
    onSuccess: () => {
      message.success('Profile updated successfully!');
    },
    onError: (error: unknown) => {
      message.error(
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the profile.'
      );
    },
  });

  // Handle form submission
  const onFinish = (values: any) => {
    updateMutation.mutate(values);
  };

  if (isLoading) return <div>Loading user info...</div>;
  if (isError) return <div>Error: {error instanceof Error ? error.message : 'Failed to load user info'}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1>Update Your Profile</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: '',
          email: '',
          password: '', 
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              min: 6,
              message: 'Password must be at least 6 characters long.',
            },
          ]}
        >
          <Input.Password placeholder="Leave empty to keep current password" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateMutation.isLoading}
            block
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserProfileForm;

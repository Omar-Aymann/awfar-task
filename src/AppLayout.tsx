import React from 'react';
import { Layout, Menu } from 'antd';
import { LogoutOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const selectedKey = location.pathname.includes('/tasks')
    ? 'tasks'
    : location.pathname.includes('/myaccount')
    ? 'myaccount'
    : '';
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" collapsible>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
          <Menu.Item key="tasks" icon={<FileTextOutlined />} >
            <Link to="/tasks">Tasks</Link>
          </Menu.Item>
          <Menu.Item   key="myaccount" icon={<UserOutlined />}>
            <Link to="/myaccount">My Account</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <Outlet /> {/* This renders the child route content like HomePage, TasksPage */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

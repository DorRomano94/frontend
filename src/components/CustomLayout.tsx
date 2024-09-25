import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  HomeOutlined,
  FileOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import authStore from '../stores/authStore';

const { Sider, Content } = Layout;

interface CustomLayoutProps {
  children: ReactNode;
}

const CustomLayout: React.FC<CustomLayoutProps> = observer(({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/portfolio',
      icon: <HomeOutlined />,
      label: <Link to="/portfolio">Portfolio</Link>,
    }
  ];

  return (
    <Layout style={{ height: '97vh' }}>
      <Sider width={250} theme="light" style={{ position: 'relative' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />

        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '0 16px' }}>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ width: '100%' }}
          >
            Logout
          </Button>
        </div>
      </Sider>

      <Content style={{ padding: '0 20px', height: '97vh', width: '100%' }}>
        {children}
      </Content>
    </Layout>
  );
});

export default CustomLayout;

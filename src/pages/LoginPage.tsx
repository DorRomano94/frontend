import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import authStore from '../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, values);
            if (response.data.token) {
                authStore.setUser(response.data);
                navigate('/portfolio');
            } else {
                message.error('Login failed, please try again.');
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || 'An error occurred, please try again.');
        }
        setLoading(false);
    };

    return (
        <Form onFinish={onFinish}>
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Login
                </Button>
            </Form.Item>
            <Form.Item>
                <Link to="/register">Don't have an account? Register here</Link>
            </Form.Item>
        </Form>
    );
};

export default LoginPage;

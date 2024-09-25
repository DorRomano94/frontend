import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const RegistrationPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { name: string; email: string; password: string }) => {
        setLoading(true);
        try {
            await axios.post(`${apiUrl}/users`, {
                name: values.name,
                email: values.email,
                password: values.password,
            });
            navigate('/login');
        } catch (error) {
            console.error("Registration error:", error);
            message.error('Registration failed, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onFinish={onFinish}>
            <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                <Input placeholder="Name" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Register
                </Button>
            </Form.Item>
            <Form.Item>
                <Link to="/login">Already have an account? Login here</Link>
            </Form.Item>
        </Form>
    );
};

export default RegistrationPage;

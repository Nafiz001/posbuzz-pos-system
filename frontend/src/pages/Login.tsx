import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 450,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8, color: '#1890ff' }}>
            PosBuzz POS System
          </Title>
          <Text type="secondary">Welcome back! Please login to your account</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#1890ff' }} />} 
              placeholder="your.email@example.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{ 
                height: 48,
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 8
              }}
            >
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Don't have an account?{' '}
              <Link to="/register" style={{ fontWeight: 500 }}>
                Register now
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}

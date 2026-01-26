import { Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import { ShoppingOutlined, DollarOutlined, ShoppingCartOutlined, RiseOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const { Title } = Typography;

interface Product {
  id: string;
  price: number;
  stock_quantity: number;
}

interface Sale {
  id: string;
  total: number;
}

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data as Product[];
    },
  });

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await api.get('/sales');
      return response.data as Sale[];
    },
  });

  const totalProducts = products?.length || 0;
  const totalSales = sales?.length || 0;
  const totalRevenue = sales?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  const totalStock = products?.reduce((sum, product) => sum + product.stock_quantity, 0) || 0;

  const isLoading = productsLoading || salesLoading;

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Dashboard</Title>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 8 }}>
                <Statistic
                  title="Total Products"
                  value={totalProducts}
                  prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 8 }}>
                <Statistic
                  title="Total Stock"
                  value={totalStock}
                  prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 8 }}>
                <Statistic
                  title="Total Sales"
                  value={totalSales}
                  prefix={<ShoppingCartOutlined style={{ color: '#722ed1' }} />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ borderRadius: 8 }}>
                <Statistic
                  title="Total Revenue"
                  value={totalRevenue}
                  prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                  precision={2}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

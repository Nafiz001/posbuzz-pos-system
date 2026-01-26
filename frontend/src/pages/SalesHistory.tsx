import { useQuery } from '@tanstack/react-query';
import { Table, Card, Typography, Tag, Space, Descriptions, Modal, Button } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import api from '../lib/api';

const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

interface SaleItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Sale {
  id: string;
  total: number;
  createdAt: string;
  items: SaleItem[];
}

export default function SalesHistory() {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await api.get('/sales');
      return response.data;
    },
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const showDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSale(null);
  };

  const columns = [
    {
      title: 'Sale ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Text code style={{ fontSize: 12 }}>
          {id.substring(0, 8)}...
        </Text>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Sale, b: Sale) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: SaleItem[]) => (
        <Tag color="blue" icon={<ShoppingCartOutlined />}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Tag>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      sorter: (a: Sale, b: Sale) => a.total - b.total,
      render: (total: number) => (
        <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
          ${total.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Sale) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'name',
    },
    {
      title: 'SKU',
      dataIndex: ['product', 'sku'],
      key: 'sku',
      render: (sku: string) => <Tag color="blue">{sku}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_: unknown, record: SaleItem) => (
        <Text strong>${(record.price * record.quantity).toFixed(2)}</Text>
      ),
    },
  ];

  const totalRevenue = sales?.reduce((sum: number, sale: Sale) => sum + sale.total, 0) || 0;
  const totalSales = sales?.length || 0;
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div>
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Sales History</Title>
            <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
              View all completed sales transactions
            </p>
          </div>
          <Space size="large">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{totalSales}</div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>Total Sales</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                ${totalRevenue.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>Total Revenue</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                ${averageSale.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>Average Sale</div>
            </div>
          </Space>
        </div>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={sales}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} sales`,
            showSizeChanger: true,
          }}
        />
      </Card>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Sale Details
          </Title>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedSale && (
          <div style={{ marginTop: 16 }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Sale ID" span={2}>
                <Text code>{selectedSale.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Date & Time" span={2}>
                {new Date(selectedSale.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Total Items">
                {selectedSale.items.length}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                  ${selectedSale.total.toFixed(2)}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>
              Items
            </Title>
            <Table
              columns={itemColumns}
              dataSource={selectedSale.items}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

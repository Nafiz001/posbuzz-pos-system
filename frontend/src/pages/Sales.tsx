import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Row,
  Col,
  Card,
  Select,
  InputNumber,
  Button,
  Table,
  message,
  Statistic,
  Space,
  Typography,
  Empty,
  Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined, ShoppingCartOutlined, ClearOutlined } from '@ant-design/icons';
import api from '../lib/api';

const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
}

interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export default function Sales() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    },
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const createSaleMutation = useMutation({
    mutationFn: async (items: any[]) => {
      const response = await api.post('/sales', { items });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      message.success('Sale completed successfully!');
      setCart([]);
      setSelectedProductId('');
      setQuantity(1);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Sale failed');
    },
  });

  const addToCart = () => {
    if (!selectedProductId) {
      message.warning('Please select a product');
      return;
    }

    if (quantity <= 0) {
      message.warning('Quantity must be greater than 0');
      return;
    }

    const product = products?.find((p: Product) => p.id === selectedProductId);
    if (!product) return;

    // Check stock
    const existingCartItem = cart.find(item => item.productId === selectedProductId);
    const totalQuantity = (existingCartItem?.quantity || 0) + quantity;
    
    if (totalQuantity > product.stock_quantity) {
      message.error(`Not enough stock! Available: ${product.stock_quantity}`);
      return;
    }

    if (existingCartItem) {
      setCart(cart.map(item =>
        item.productId === selectedProductId
          ? {
              ...item,
              quantity: item.quantity + quantity,
              subtotal: (item.quantity + quantity) * product.price,
            }
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          product,
          quantity,
          subtotal: quantity * product.price,
        },
      ]);
    }

    message.success(`Added ${quantity} × ${product.name} to cart`);
    setSelectedProductId('');
    setQuantity(1);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
    message.info('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    message.info('Cart cleared');
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning('Cart is empty');
      return;
    }

    const items = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    createSaleMutation.mutate(items);
  };

  const cartColumns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'name',
      render: (name: string, record: CartItem) => (
        <div>
          <strong>{name}</strong>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.product.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: ['product', 'price'],
      key: 'price',
      render: (price: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>${price.toFixed(2)}</span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <span style={{ fontSize: 16, fontWeight: 'bold' }}>{quantity}</span>
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => (
        <span style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
          ${subtotal.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.productId)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          Point of Sale
        </Title>
        <Text type="secondary">Create new sales and manage transactions</Text>
      </Card>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={<span style={{ fontSize: 16, fontWeight: 600 }}>Add Items to Cart</span>}
            bordered={false}
            style={{ marginBottom: 16 }}
          >
            <Space.Compact style={{ width: '100%' }} size="large">
              <Select
                showSearch
                placeholder="Select a product"
                style={{ flex: 1 }}
                value={selectedProductId || undefined}
                onChange={setSelectedProductId}
                optionFilterProp="label"
                size="large"
                options={products?.filter((p: Product) => p.stock_quantity > 0).map((p: Product) => ({
                  value: p.id,
                  label: `${p.name} (${p.sku}) - $${p.price.toFixed(2)} - Stock: ${p.stock_quantity}`,
                }))}
                notFoundContent={<Empty description="No products available" />}
              />
              <InputNumber
                min={1}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                style={{ width: 120 }}
                placeholder="Qty"
                size="large"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addToCart}
                size="large"
              >
                Add
              </Button>
            </Space.Compact>
          </Card>

          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Shopping Cart</span>
                {cart.length > 0 && (
                  <Button
                    type="text"
                    danger
                    icon={<ClearOutlined />}
                    onClick={clearCart}
                    size="small"
                  >
                    Clear Cart
                  </Button>
                )}
              </div>
            }
            bordered={false}
          >
            {cart.length === 0 ? (
              <Empty 
                description="Your cart is empty"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: '60px 0' }}
              />
            ) : (
              <Table
                columns={cartColumns}
                dataSource={cart}
                rowKey="productId"
                pagination={false}
                size="middle"
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ position: 'sticky', top: 16 }}>
            <Title level={4} style={{ marginTop: 0 }}>Order Summary</Title>
            <Divider style={{ margin: '16px 0' }} />
            
            <div style={{ marginBottom: 24 }}>
              <Row justify="space-between" style={{ marginBottom: 12 }}>
                <Text>Items:</Text>
                <Text strong>{cart.length}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 12 }}>
                <Text>Total Quantity:</Text>
                <Text strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</Text>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Statistic
              title={<span style={{ fontSize: 16 }}>Total Amount</span>}
              value={total}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a', fontSize: 36, fontWeight: 'bold' }}
              style={{ marginBottom: 24 }}
            />
            
            <Button
              type="primary"
              size="large"
              block
              icon={<ShoppingCartOutlined />}
              onClick={handleCheckout}
              loading={createSaleMutation.isPending}
              disabled={cart.length === 0}
              style={{ 
                height: 56,
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Complete Sale
            </Button>

            {cart.length === 0 && (
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16, fontSize: 12 }}>
                Add items to cart to complete a sale
              </Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

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
} from 'antd';
import { PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import api from '../lib/api';

const { Title } = Typography;

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
  });

  const createSaleMutation = useMutation({
    mutationFn: async (items: any[]) => {
      const response = await api.post('/sales', { items });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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

    setSelectedProductId('');
    setQuantity(1);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
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
    },
    {
      title: 'Price',
      dataIndex: ['product', 'price'],
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
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `$${subtotal.toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: CartItem) => (
        <Button
          type="link"
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
      <Title level={2}>POS - Point of Sale</Title>
      
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Add to Cart" style={{ marginBottom: 16 }}>
            <Space.Compact style={{ width: '100%' }}>
              <Select
                showSearch
                placeholder="Select a product"
                style={{ flex: 1 }}
                value={selectedProductId || undefined}
                onChange={setSelectedProductId}
                optionFilterProp="label"
                options={products?.map((p: Product) => ({
                  value: p.id,
                  label: `${p.name} (${p.sku}) - Stock: ${p.stock_quantity}`,
                }))}
              />
              <InputNumber
                min={1}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                style={{ width: 100 }}
                placeholder="Qty"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addToCart}
              >
                Add
              </Button>
            </Space.Compact>
          </Card>

          <Card title="Cart">
            <Table
              columns={cartColumns}
              dataSource={cart}
              rowKey="productId"
              pagination={false}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Total Amount"
              value={total}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#3f8600', fontSize: 32 }}
            />
            <Button
              type="primary"
              size="large"
              block
              icon={<ShoppingCartOutlined />}
              onClick={handleCheckout}
              loading={createSaleMutation.isPending}
              disabled={cart.length === 0}
              style={{ marginTop: 24 }}
            >
              Complete Sale
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

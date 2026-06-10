/* eslint-disable */
// Standalone seed script: node prisma/seed.js
// Populates a login user, product catalog, and ~14 days of sales.
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const PRODUCTS = [
  { name: 'Espresso', sku: 'BEV-ESP-001', price: 2.5, stock_quantity: 500 },
  { name: 'Cappuccino', sku: 'BEV-CAP-002', price: 3.75, stock_quantity: 400 },
  { name: 'Latte', sku: 'BEV-LAT-003', price: 4.0, stock_quantity: 400 },
  { name: 'Cold Brew', sku: 'BEV-CLD-004', price: 4.5, stock_quantity: 300 },
  { name: 'Green Tea', sku: 'BEV-GRN-005', price: 3.0, stock_quantity: 250 },
  { name: 'Croissant', sku: 'FOO-CRO-006', price: 3.25, stock_quantity: 200 },
  { name: 'Blueberry Muffin', sku: 'FOO-MUF-007', price: 3.5, stock_quantity: 180 },
  { name: 'Avocado Toast', sku: 'FOO-AVO-008', price: 7.5, stock_quantity: 120 },
  { name: 'Chicken Sandwich', sku: 'FOO-SAN-009', price: 8.95, stock_quantity: 150 },
  { name: 'Caesar Salad', sku: 'FOO-SAL-010', price: 9.5, stock_quantity: 100 },
  { name: 'Bottled Water', sku: 'BEV-WAT-011', price: 1.5, stock_quantity: 600 },
  { name: 'Chocolate Cookie', sku: 'FOO-COO-012', price: 2.25, stock_quantity: 300 },
];

// deterministic pseudo-random so reruns are stable-ish
function pick(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = (i * 7 + n * 3) % copy.length;
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

async function main() {
  // 1) Login user
  const email = 'admin@posbuzz.com';
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed },
  });
  console.log(`User ready: ${email} / ${password}`);

  // 2) Products
  const products = [];
  for (const p of PRODUCTS) {
    const prod = await prisma.product.upsert({
      where: { sku: p.sku },
      update: { name: p.name, price: p.price, stock_quantity: p.stock_quantity },
      create: p,
    });
    products.push(prod);
  }
  console.log(`Products ready: ${products.length}`);

  // 3) Sales spread across the last 14 days
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  let saleCount = 0;
  let itemCount = 0;

  for (let d = 13; d >= 0; d--) {
    const salesToday = 3 + (d % 4); // 3..6 sales per day
    for (let s = 0; s < salesToday; s++) {
      const when = new Date(now - d * DAY - s * 90 * 60 * 1000); // staggered through the day
      const lineCount = 1 + ((d + s) % 4); // 1..4 distinct products
      const chosen = pick(products, lineCount);

      let total = 0;
      const itemsData = chosen.map((prod, i) => {
        const quantity = 1 + ((i + s) % 3); // 1..3
        total += prod.price * quantity;
        return { productId: prod.id, quantity, price: prod.price };
      });

      await prisma.sale.create({
        data: {
          total: Math.round(total * 100) / 100,
          createdAt: when,
          items: { create: itemsData },
        },
      });
      saleCount++;
      itemCount += itemsData.length;
    }
  }
  console.log(`Sales created: ${saleCount} (${itemCount} line items)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

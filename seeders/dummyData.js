const bcrypt = require('bcryptjs');
const sequelize = require('../db');
const {
  User,
  UserAddress,
  Category,
  Brand,
  Product,
  ProductMedia,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Shipment
} = require('../models');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    logger.info('Starting data seeding...');

    // 1. Create Categories
    logger.info('Seeding categories...');
    const categories = await Category.bulkCreate([
      { name: 'Laptop', slug: 'laptop' },
      { name: 'Smartphone', slug: 'smartphone' },
      { name: 'Audio', slug: 'audio' },
      { name: 'Peripheral', slug: 'peripheral' },
      { name: 'Wearable', slug: 'wearable' }
    ]);

    // 2. Create Brands
    logger.info('Seeding brands...');
    const brands = await Brand.bulkCreate([
      { name: 'Asus', slug: 'asus' },
      { name: 'Samsung', slug: 'samsung' },
      { name: 'Sony', slug: 'sony' },
      { name: 'Keychron', slug: 'keychron' },
      { name: 'Apple', slug: 'apple' }
    ]);

    // 3. Create Users
    logger.info('Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.bulkCreate([
      {
        full_name: 'John Doe',
        nickname: 'johndoe',
        email: 'john@example.com',
        phone: '081234567890',
        password: hashedPassword,
        birthday: '1990-01-15'
      },
      {
        full_name: 'Jane Smith',
        nickname: 'janesmith',
        email: 'jane@example.com',
        phone: '081234567891',
        password: hashedPassword,
        birthday: '1992-05-20'
      },
      {
        full_name: 'Bob Wilson',
        nickname: 'bobwilson',
        email: 'bob@example.com',
        phone: '081234567892',
        password: hashedPassword,
        birthday: '1988-08-10'
      },
      {
        full_name: 'Alice Johnson',
        nickname: 'alicejohnson',
        email: 'alice@example.com',
        phone: '081234567893',
        password: hashedPassword,
        birthday: '1995-03-25'
      },
      {
        full_name: 'Charlie Brown',
        nickname: 'charliebrown',
        email: 'charlie@example.com',
        phone: '081234567894',
        password: hashedPassword,
        birthday: '1991-11-30'
      }
    ]);

    // 4. Create User Addresses
    logger.info('Seeding user addresses...');
    await UserAddress.bulkCreate([
      {
        user_id: users[0].id,
        label: 'Home',
        recipient_name: 'John Doe',
        phone: '081234567890',
        address_line: 'Jl. Sudirman No. 123',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postal_code: '12190',
        is_default: true
      },
      {
        user_id: users[1].id,
        label: 'Office',
        recipient_name: 'Jane Smith',
        phone: '081234567891',
        address_line: 'Jl. Thamrin No. 456',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postal_code: '10230',
        is_default: true
      }
    ]);

    // 5. Create Products
    logger.info('Seeding products...');
    const products = await Product.bulkCreate([
      {
        name: 'Laptop Asus VivoBook 14 A1400',
        description: 'Laptop ringan dengan prosesor AMD Ryzen 5, RAM 8GB, dan SSD 512GB.',
        brand_id: brands[0].id,
        category_id: categories[0].id,
        price: 8499000,
        stock: 12,
        rating: 4.7
      },
      {
        name: 'Smartphone Samsung Galaxy A55 5G',
        description: 'Smartphone mid-range dengan layar Super AMOLED 6.6 inci, baterai 5000mAh.',
        brand_id: brands[1].id,
        category_id: categories[1].id,
        price: 5999000,
        stock: 20,
        rating: 4.8
      },
      {
        name: 'Headphone Sony WH-1000XM5',
        description: 'Headphone wireless dengan noise cancelling terbaik di kelasnya.',
        brand_id: brands[2].id,
        category_id: categories[2].id,
        price: 4999000,
        stock: 15,
        rating: 4.9
      },
      {
        name: 'Mechanical Keyboard Keychron K6 RGB',
        description: 'Keyboard mechanical 65% layout dengan switch Gateron Brown.',
        brand_id: brands[3].id,
        category_id: categories[3].id,
        price: 1350000,
        stock: 25,
        rating: 4.6
      },
      {
        name: 'Smartwatch Apple Watch SE 2nd Gen',
        description: 'Smartwatch dengan fitur pelacak kebugaran dan sensor detak jantung.',
        brand_id: brands[4].id,
        category_id: categories[4].id,
        price: 5499000,
        stock: 18,
        rating: 4.8
      }
    ]);

    // 6. Create Product Media
    logger.info('Seeding product media...');
    await ProductMedia.bulkCreate([
      { product_id: products[0].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1587202372775-98927d7dbd06?w=800' },
      { product_id: products[0].id, media_type: 'video', url: 'https://www.youtube.com/watch?v=z4H5o4_yN6w' },
      { product_id: products[1].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800' },
      { product_id: products[2].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=800' },
      { product_id: products[3].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1607083205972-7eec3b7b8a7b?w=800' },
      { product_id: products[4].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' }
    ]);

    // 7. Create Carts
    logger.info('Seeding carts...');
    const carts = await Cart.bulkCreate([
      { user_id: users[0].id },
      { user_id: users[1].id },
      { user_id: users[2].id }
    ]);

    // 8. Create Cart Items
    logger.info('Seeding cart items...');
    await CartItem.bulkCreate([
      { cart_id: carts[0].id, product_id: products[0].id, quantity: 1 },
      { cart_id: carts[0].id, product_id: products[2].id, quantity: 1 },
      { cart_id: carts[1].id, product_id: products[1].id, quantity: 1 },
      { cart_id: carts[1].id, product_id: products[3].id, quantity: 2 }
    ]);

    // 9. Create Orders
    logger.info('Seeding orders...');
    const orders = await Order.bulkCreate([
      {
        user_id: users[0].id,
        status: 'paid',
        total_amount: 8499000,
        shipping_cost: 20000,
        payment_method: 'bank_transfer'
      },
      {
        user_id: users[1].id,
        status: 'shipped',
        total_amount: 5999000,
        shipping_cost: 20000,
        payment_method: 'credit_card'
      },
      {
        user_id: users[2].id,
        status: 'delivered',
        total_amount: 4999000,
        shipping_cost: 20000,
        payment_method: 'e_wallet'
      }
    ]);

    // 10. Create Order Items
    logger.info('Seeding order items...');
    await OrderItem.bulkCreate([
      {
        order_id: orders[0].id,
        product_id: products[0].id,
        product_name_snapshot: products[0].name,
        price_snapshot: products[0].price,
        quantity: 1
      },
      {
        order_id: orders[1].id,
        product_id: products[1].id,
        product_name_snapshot: products[1].name,
        price_snapshot: products[1].price,
        quantity: 1
      },
      {
        order_id: orders[2].id,
        product_id: products[2].id,
        product_name_snapshot: products[2].name,
        price_snapshot: products[2].price,
        quantity: 1
      }
    ]);

    // 11. Create Payments
    logger.info('Seeding payments...');
    await Payment.bulkCreate([
      {
        order_id: orders[0].id,
        provider: 'bank_transfer',
        status: 'paid',
        transaction_id: 'TRX-20251103-0001',
        amount: 8519000,
        paid_at: new Date()
      },
      {
        order_id: orders[1].id,
        provider: 'credit_card',
        status: 'paid',
        transaction_id: 'TRX-20251103-0002',
        amount: 6019000,
        paid_at: new Date()
      },
      {
        order_id: orders[2].id,
        provider: 'e_wallet',
        status: 'paid',
        transaction_id: 'TRX-20251103-0003',
        amount: 5019000,
        paid_at: new Date()
      }
    ]);

    // 12. Create Shipments
    logger.info('Seeding shipments...');
    await Shipment.bulkCreate([
      {
        order_id: orders[0].id,
        courier: 'JNE',
        tracking_number: 'JNE-20251103-0001',
        status: 'waiting_pickup'
      },
      {
        order_id: orders[1].id,
        courier: 'SiCepat',
        tracking_number: 'SICEPAT-20251103-0002',
        status: 'shipped',
        shipped_at: new Date()
      },
      {
        order_id: orders[2].id,
        courier: 'J&T',
        tracking_number: 'JT-20251103-0003',
        status: 'delivered',
        shipped_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        delivered_at: new Date()
      }
    ]);

    logger.info('✅ All data seeded successfully!');
    logger.info('');
    logger.info('Test credentials:');
    logger.info('Email: john@example.com');
    logger.info('Password: password123');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder
seedData();
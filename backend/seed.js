const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

// Explicit imports matching your folder structure
const User = require("./model/user");
const Product = require("./model/Product");
const Order = require("./model/Order");

const productsData = [
  {
    name: "Smart Fitness Watch",
    description:
      "Heart rate monitor, step tracker, and sleep tracking with OLED display.",
    price: 1999,
    category: "Electronics",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    rating: 4.2,
    numReviews: 8,
  },
  {
    name: "Classic Cotton T-Shirt",
    description:
      "100% pure premium cotton breathable casual daily wear t-shirt.",
    price: 499,
    category: "Fashion",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    rating: 4.0,
    numReviews: 5,
  },
  {
    name: "RGB Mechanical Gaming Keyboard",
    description:
      "Tactile mechanical switches with dynamic RGB backlighting and wrist rest.",
    price: 3499,
    category: "Electronics",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: "Insulated Stainless Steel Bottle",
    description:
      "Double-wall vacuum insulated bottle keeping drinks cold for 24 hours.",
    price: 899,
    category: "Fitness",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    rating: 4.6,
    numReviews: 9,
  },
  {
    name: "Ergonomic Wireless Optical Mouse",
    description:
      "Precision 2.4GHz wireless tracking with comfortable silent click grip.",
    price: 799,
    category: "Electronics",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
    rating: 4.4,
    numReviews: 11,
  },
  {
    name: "Vintage Instant Film Camera",
    description:
      "Classic instant camera featuring autofocus and built-in flash.",
    price: 5499,
    category: "Electronics",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    rating: 4.9,
    numReviews: 24,
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Rugged waterproof outdoor speaker with deep bass and 12-hour battery.",
    price: 2499,
    category: "Electronics",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d",
    rating: 4.8,
    numReviews: 18,
  },
  {
    name: "Minimalist Matte Desk Lamp",
    description:
      "Adjustable architect metal reading lamp with soft eye-protection light.",
    price: 1299,
    category: "Home & Living",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    rating: 4.3,
    numReviews: 7,
  },
];

const importData = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      process.env.DATABASE_URL;

    if (!mongoUri) {
      throw new Error("MongoDB URI variable not found in .env file.");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear old data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Cleared existing collections...");

    // Hash passwords
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      }),
    );

    // Insert Users and Products
    const createdUsers = await User.insertMany(hashedUsers);
    const createdProducts = await Product.insertMany(productsData);

    const normalUser = createdUsers[1]; // John Doe

    // Insert sample Order
    const sampleOrder = new Order({
      user: normalUser._id,
      items: [
        {
          productId: createdProducts[0]._id,
          quantity: 1,
          price: createdProducts[0].price,
        },
        {
          productId: createdProducts[2]._id,
          quantity: 2,
          price: createdProducts[2].price,
        },
      ],
      totalAmount: createdProducts[0].price + createdProducts[2].price * 2,
      address: "123 Main Street, Cityville, State 12345",
      paymentId: "PAY_TEST_987654321",
      status: "Processing",
    });

    await sampleOrder.save();

    console.log("Data Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error Seeding Data: ${error.message}`);
    process.exit(1);
  }
};

importData();

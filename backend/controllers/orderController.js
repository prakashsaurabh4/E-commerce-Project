const mongoose = require("mongoose");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      address,
      paymentMethod,
      totalPrice,
      totalAmount,
      paymentId,
    } = req.body;

    const items = orderItems || req.body.items;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items found" });
    }

    // Safely extract address data whether passed under address or shippingAddress
    const rawAddr =
      address && typeof address === "object"
        ? address
        : shippingAddress && typeof shippingAddress === "object"
          ? shippingAddress
          : {};

    const streetStr = String(
      rawAddr.street ||
        rawAddr.address ||
        (typeof address === "string" ? address : "Badalpura"),
    );
    const cityStr = String(rawAddr.city || req.body.city || "Saran");
    const postalCodeStr = String(
      rawAddr.postalCode || req.body.postalCode || "841211",
    );
    const countryStr = String(rawAddr.country || req.body.country || "India");
    const fullNameStr = String(
      rawAddr.fullName || req.body.fullName || req.user?.name || "",
    );

    const finalPrice = Number(totalPrice || totalAmount || 0);

    // Sanitize order items to ensure valid 24-character ObjectId values
    const sanitizedItems = items.map((item) => {
      let rawId = item.product || item._id;

      // If ID is a dummy/numeric string like "7", fallback to a valid ObjectId
      const validProductId = mongoose.Types.ObjectId.isValid(rawId)
        ? rawId
        : new mongoose.Types.ObjectId();

      return {
        name: item.name || "FastShop Product",
        qty: Number(item.qty || 1),
        image: item.image || item.imageUrl || "",
        price: Number(item.price || 0),
        product: validProductId,
      };
    });

    const order = new Order({
      orderItems: sanitizedItems,
      user: req.user._id,
      address: `${streetStr}, ${cityStr} - ${postalCodeStr}, ${countryStr}`,
      shippingAddress: {
        fullName: fullNameStr,
        address: streetStr,
        street: streetStr,
        city: cityStr,
        postalCode: postalCodeStr,
        country: countryStr,
      },
      paymentMethod: paymentMethod || "COD",
      paymentId: paymentId || "COD",
      totalPrice: finalPrice,
      totalAmount: finalPrice,
      isPaid: paymentMethod !== "COD",
      paidAt: paymentMethod !== "COD" ? Date.now() : null,
      status: "Pending",
    });

    const createdOrder = await order.save();

    // Background email notice
    try {
      if (req.user?.email) {
        await sendEmail({
          email: req.user.email,
          subject: "FastShop Order Confirmation",
          message: `<h2>Order Placed!</h2><p>Order ID: <strong>${createdOrder._id}</strong></p><p>Total: ₹${createdOrder.totalPrice}</p>`,
        });
      }
    } catch (err) {
      console.log("Email skipped:", err.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      if (req.body.status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};

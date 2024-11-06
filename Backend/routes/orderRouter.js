const express = require("express");
const bodyParser = require("body-parser");
const Order = require("../models/order");
const Book = require("../models/book");
const authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const orderRouter = express.Router();
orderRouter.use(bodyParser.json());

orderRouter.get(
  "/user",
  cors.cors,
  authenticate.verifyUser,
  (req, res, next) => {
    Order.find({ user: req.user._id })
      .populate("user", "fullname")
      .populate("order_details.book", "_id title author price imageurls")
      .then(
        (order) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(order);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

orderRouter.get(
  "/admin",
  cors.cors,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Order.find()
      .populate("user", "fullname phone address")
      .populate("order_details.book", "_id title author price imageurls")
      .then((order) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      });
  }
);

//status update
orderRouter.post(
  "/status/:orderId",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Order.findByIdAndUpdate(
      req.params.orderId,
      {
        $set: { order_status: req.body.status },
      },
      { new: true }
    )
      .then(
        (order) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(order);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

orderRouter.post(
  "/createOrder",
  cors.corsWithOptions,
  authenticate.verifyUser,
  async (req, res, next) => {
    try {
      const newOrder = await Order.create({
        user: req.user._id,
        total_price: req.body.amount,
        total_quantity: req.body.quantity,
        address: req.body.address, // Use the address from the request body
        phone: req.body.phone, // Use the phone from the request body
        order_details: req.body.order_details.map((detail) => ({
          book: detail.book,
          order_quantity: detail.order_quantity,
          order_price: detail.order_price,
        })),
      });

      req.body.order_details.forEach(async (detail) => {
        await Book.findByIdAndUpdate(detail.book, {
          $inc: { quantity: -detail.order_quantity },
        });
      });
      res.status(200).json(newOrder);
    } catch (err) {
      console.error("Error creating order:", err); // Log the error
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  }
);

orderRouter.get(
  "/totalOrders",
  cors.cors,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Order.countDocuments({ order_status: "Success" }) // Count only orders with status "Success"
      .then((total) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ total_orders: total });
      })
      .catch((err) => next(err));
  }
);

module.exports = orderRouter;

// server.js
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// ================= CORS =================
const allowedOrigins = [
  "https://frontend.theawsn.shop",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // server-to-server or Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(compression());

// Allow private network access (sometimes required by Chrome)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("🚀 Order Service is running successfully");
});

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "order-service"
  });
});

// ================= DATABASE CONNECTION =================
(async () => {
  try {
    await db.connect();
    console.log("✅ MySQL Database connected (Order Service)");
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
  }
})();

// ================= ROUTES =================

// GET all orders
app.get("/orders", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders");
    res.json(rows);
  } catch (error) {
    console.error("ORDER FETCH ERROR:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE new order
app.post("/orders", async (req, res) => {
  const { user_id, product_name, amount } = req.body;

  if (!user_id || !product_name || !amount) {
    return res.status(400).json({
      error: "user_id, product_name and amount are required"
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO orders (user_id, product_name, amount) VALUES (?, ?, ?)",
      [user_id, product_name, amount]
    );

    res.status(201).json({
      message: "Order created successfully",
      orderId: result.insertId
    });
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ================= START SERVER =================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
});

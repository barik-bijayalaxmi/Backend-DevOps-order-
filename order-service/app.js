const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/orders", (req, res) => {
  res.json([
    { orderId: 101, product: "Laptop" },
    { orderId: 102, product: "Phone" }
  ]);
});

app.get("/health", (req, res) => {
  res.send("Order Service is healthy");
});

app.listen(PORT, () =>
  console.log(`Order Service running on port ${PORT}`)
);

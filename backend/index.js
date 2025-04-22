require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet"); // Security headers
const morgan = require("morgan"); // HTTP request logging
const path = require("path");
// Load Routes
const categoryRoutes = require("./routes/categoryRoutes");
const beatRoutes = require("./routes/beatRoutes"); // Import beatRoutes
const supplierRoutes = require("./routes/supplierRoutes"); // Import supplierRoutes
const purchaseRoutes = require("./routes/purchaseRoutes"); // Import purchaseRoutes
const itemRoutes = require("./routes/itemRoutes"); // Import itemRoutes
const customerRoutes = require("./routes/customerRoutes");
const salesRoutes = require("./routes/sales");
const firmRoutes = require("./routes/firmRoutes");

const printerRoutes = require("./routes/printerRoutes");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow frontend requests
app.use(helmet()); // Add security headers
app.use(morgan("dev")); // Log HTTP requests
// Serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB with Retry
const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/FieldExpo", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};
connectWithRetry();

// Mount Routes
app.use("/api/categories", categoryRoutes);
app.use("/api", beatRoutes); // Mount beatRoutes under /api prefix
app.use("/api/suppliers", supplierRoutes); // Mount supplierRoutes under /api/suppliers prefix
app.use("/api/purchase", purchaseRoutes); // Mount purchaseRoutes under /api/purchase prefix
app.use("/api/items", itemRoutes); // Mount itemRoutes under /api/items prefix
// Routes
app.use("/api", customerRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/firm", firmRoutes);
app.use("/api/printer", printerRoutes);

app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(400).json({ error: "Duplicate key error" });
  }

  res.status(500).json({ error: "Something went wrong!" });
});
// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

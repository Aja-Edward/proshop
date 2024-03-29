import path from "path";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import stripePay from "./utils/stripePay.js";

dotenv.config();
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Edward your API is now running...");
});

app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.get("/api/config/stripe", stripePay);

app.get("/api/config/paystack", (req, res) =>
  res.send(process.env.PAYSTACK_PUBLIC_KEY)
);

app.get("/api/config/flutterwave", (req, res) =>
  res.send(process.env.FLUTTER_PUBLIC_KEY)
);

app.get("api/config/remitta", (req, res) =>
  res.send(process.env.REMITTA_PUBLIC_KEY)
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Edward your Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
      .yellow.bold
  )
);

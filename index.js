import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import categoryRoute from "./routes/category.route.js";
import dishRoute from "./routes/dish.route.js";
import userRoutes from "./routes/user.route.js";
// .env
dotenv.config();
const port = process.env.PORT || 3333;
// App
const app = express();
const __filename = fileURLToPath(import.meta.url); // Lấy tên file
const __dirname = path.dirname(__filename); // Lấy đường dẫn thư mục

// middlle ware
app.use(cors());
// app.use(auth);
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/users", userRoutes);
// category route
app.use(categoryRoute);
// dish route
app.use(dishRoute);

// connect to db
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB succcesfully!"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.get("/", (req, res) => {
  res.send("This is my server using port 1111");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

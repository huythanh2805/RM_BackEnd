import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import categoryRoute from "./routes/category.route.js";
import dishRoute from "./routes/dish.route.js";
import userRoutes from "./routes/user.route.js";
import tableRoute from "./routes/table.route.js";
import locationRoute from "./routes/location.route.js";
import reservationRoute from "./routes/Reservation.route.js";
import orderedFoodRoute from "./routes/orderedFood.route.js";
// .env
dotenv.config();
const port = process.env.PORT || 3333;
// App
const app = express();

// middlle ware
app.use(cors());
app.use(express.json());
// app.use(auth);
app.use("/users", userRoutes);
// category route
app.use(categoryRoute);
// dish route
app.use(dishRoute);
// table route
app.use("/api/reservations", tableRoute);
// location route
app.use("/api/reservations", locationRoute);
// reservation route
app.use("/api", reservationRoute);
// orderedFood route
app.use("/api", orderedFoodRoute);

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

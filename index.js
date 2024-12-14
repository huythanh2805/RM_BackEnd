import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import billRoute from "./routes/bill.route.js";
import categoryRoute from "./routes/category.route.js";
import conversationRoute from "./routes/conversation.route.js";
import dishRoute from "./routes/dish.route.js";
import employeeRoute from "./routes/employee.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import locationRoute from "./routes/location.route.js";
import messageRoute from "./routes/message.route.js";
import notificationRoute from "./routes/notification.route.js"; 
import orderedComboRoute from "./routes/orderedCombo.route.js";
import orderedFoodRoute from "./routes/orderedFood.route.js";
import reservationRoute from "./routes/Reservation.route.js";
import setComboRoute from "./routes/setCombo.route.js";
import tableRoute from "./routes/table.route.js";
import userRoutes from "./routes/user.route.js";
import dashBoardRoute from "./routes/dashboard.route.js";
import discountRoute from "./routes/discount.route.js";
import userDiscountRoute from "./routes/userDiscount.route.js";
import paymentRoute from "./routes/payment.route.js";
import { startCronJob } from "./controllers/cron.controller.js";

// .env
dotenv.config();
const port = process.env.PORT || 3333;
// App
const app = express();
const __filename = fileURLToPath(import.meta.url); // Lấy tên file
const __dirname = path.dirname(__filename); // Lấy đường dẫn thư mục
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:4444", // Địa chỉ frontend
    methods: ["GET", "POST"],
  },
});

// middlle ware
app.use(cors());
app.use(express.json());
// app.use(auth);
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/users", userRoutes);
// category route
app.use(categoryRoute);
// employee route
app.use(employeeRoute);
// dish route
app.use(dishRoute);
// table route
app.use("/api/reservations", tableRoute);
// location route
app.use("/api/reservations", locationRoute);
// reservation route
app.use("/api", reservationRoute(io));
// orderedFood route
app.use("/api", orderedFoodRoute);
// orderedCombo route
app.use("/api", orderedComboRoute);
// bill route
app.use("/api", billRoute(io));
// setCombo route
app.use(setComboRoute);
// message route
app.use("/api", messageRoute);
// conversation route
app.use("/api", conversationRoute);
// dashboard route
app.use("/api", dashBoardRoute);
// feedback route
app.use("/api", notificationRoute);
// discount route
app.use("/api", discountRoute);
// user discount route
app.use("/api", userDiscountRoute);
// momo route
app.use("/api", paymentRoute);

app.use(feedbackRoute);

//cron
startCronJob();
// Socket

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`)

  // Lắng nghe sự kiện 'sendMessage' từ client
  socket.on("sendMessage", (messageData) => {
    const { roomId } = messageData;

    socket.to(roomId).emit("receiveMessage", messageData);
    // receiveMessage
  });
  // Lắng nghe sự kiện vào phòng
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    // Kiểm tra xem có bao nhiêu người join room
    const numClients = io.sockets.adapter.rooms.get(roomId)?.size || 0;
  });
  // Lắng nghe sự kiện tạo 1 conversation
  socket.on("createConversation", (data) => {
    socket.broadcast.emit("receiveConversation", data);
  });
  // Xử lý khi người dùng ngắt kết nối
  socket.on("disconnect", () => {
  });
});

// connect to db
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB succcesfully!"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.get("/", (req, res) => {
  res.send("This is my server using port 1111");
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

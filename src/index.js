require("./cron")
const express = require('express');
require('dotenv').config();
const cors = require('cors');
var path = require('path');
const ConnectDB = require('./db/connection');
const port = 8080 || process.env.PORT;
const http = require('http');
const bodyParser = require('body-parser');
const workplaceRoutes = require('./routes/workplace');
const subscriptionRoutes = require('./routes/subscription');
const billinginformationRoutes = require('./routes/billinginformation');
const serviceRoutes = require('./routes/service');
const secretariesRoutes = require('./routes/secretaries');
const HandleError = require('./middleware/errorHandler');
const notFoundMiddleware = require('./middleware/not-found');
const systemPreferenceRoutes = require('./routes/systempreference');
const calenderSettingRouter = require('./routes/calendersetting');
const userRouter = require('./routes/user');
const clientRouter = require('./routes/client');
const preferenceRouter = require('./routes/appointmentPreferences');
const scheduleRoutes = require('./routes/schedule');
const scheduleApointmentRoutes = require('./routes/scheduleAppointment');
const eventRoutes = require('./routes/event');
const messegeRoutes = require('./routes/sendmessege');
const groupRoutes = require('./routes/group');
const blogRouter = require('./routes/blog');
const foodsRoutes = require('./routes/food');
const mealPlan = require('./routes/mealplan');
const mealTemplate = require('./routes/mealTemplate');
const recipe = require('./routes/recipsInformation');
const dietarySupplements = require('./routes/dietarySupplements');
const sendInvite = require('./routes/sendInvitaion');
const client_Recommendation = require('./routes/recommendation')
const dailyplan = require('./routes/dailyplan');
const professionalPreference = require('./routes/professionalpreference');
const privacyandnotification = require('./routes/privacyAndnotification');
const CommonMeasures = require('./routes/CommonMeasures')
const foodToAvoidTamplate = require("./routes/FoodToAvoidTamplate")
const Message = require('./model/Message');
const lookup = require('./routes/lookup');
const labTest = require('./routes/LabTestRequest');
const RecommendationTemplate = require('./routes/RecommendationTemplate');
const foodDiary = require('./routes/foodDiary');
const os = require('os');
const https = require('https');
const fs = require('fs');
const { getPdfData } = require('./controller/user');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const multer = require("./middleware/messageMiddleware");
const cloudinary = require("./db/cloudinary");

// // Find the local IP address
const interfaces = os.networkInterfaces();
let localIp = 'localhost'; // Default to localhost if no IP is found

// for (const interfaceName of Object.keys(interfaces)) {
//   const interfaceInfo = interfaces[interfaceName];
//   for (const info of interfaceInfo) {
//     if (info.family === 'IPv4' && !info.internal) {
//       localIp = info.address;
//       break;
//     }
//   }
// }

// Load your SSL/TLS certificates
const privateKeyPath = path.join(__dirname, 'public', 'key.pem');
const certificatePath = path.join(__dirname, 'public', 'cert.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/uploads', express.static(__dirname + '/uploads'));

// Catch-all route
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/view'));
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/downloads', async (req, res) => {
  const clientData = await getPdfData();
  res.render('clientReport', {
    clientData,
  });
})

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  }
})

const activeRooms = new Map();

function getRoomId(senderId, receiverId) {
  const sortedIds = [senderId, receiverId].sort();
  const roomId = sortedIds.join('-');

}

io.on("connection", (socket) => {
  socket.on("join", async ({ userId, otherUserId }) => {
    socket.data.userId = userId;
    const roomId = getRoomId(userId, otherUserId);
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    try {
      const unseenMessages = await Message.countDocuments({
        senderId: otherUserId,
        receiverId: userId,
        seen: false
      });

      io.to(socket.id).emit("unseenMessages", { count: unseenMessages });
    } catch (error) {
      console.error("Error fetching unseen messages:", error);
    }
  });

  socket.on("getHistory", async ({ userId, otherUserId }) => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ]
      }).sort({ createdAt: 1 });

      const roomId = getRoomId(userId, otherUserId);

      await Message.updateMany(
        { senderId: otherUserId, receiverId: userId, seen: false },
        { $set: { seen: true } }
      );

      io.to(socket.id).emit("chatHistory", messages);
      io.to(roomId).emit("messagesSeen", { senderId: otherUserId, receiverId: userId });

    } catch (error) {
      console.error("Error in getHistory:", error);
    }
  });

  socket.on("markAsSeen", async ({ userId, otherUserId }) => {
    try {
      const roomId = getRoomId(userId, otherUserId);

      const unseenMessages = await Message.countDocuments({
        senderId: otherUserId,
        receiverId: userId,
        seen: false
      });

      if (unseenMessages > 0) {
        await Message.updateMany(
          { senderId: otherUserId, receiverId: userId, seen: false },
          { $set: { seen: true } }
        );

        io.to(roomId).emit("messagesSeen", { senderId: otherUserId, receiverId: userId });
      }

    } catch (error) {
      console.error("Error in markAsSeen:", error);
    }
  });


  socket.on("sendMessage", async ({ senderId, receiverId, message, file }) => {
    try {
      const roomId = getRoomId(senderId, receiverId);
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        fileUrl: file || null,
        roomId,
        seen: false,
        createdAt: new Date(),
      });

      await newMessage.save();

      io.to(roomId).emit("receiveMessage", newMessage);
      io.to(socket.id).emit("messageSent", newMessage);

      const socketsInRoom = await io.in(roomId).fetchSockets();
      const isReceiverInRoom = socketsInRoom.some(sock => sock.data.userId === receiverId);

      if (isReceiverInRoom) {
        await Message.updateMany(
          { senderId, receiverId, seen: false },
          { $set: { seen: true } }
        );
        io.to(roomId).emit("messagesSeen", { senderId, receiverId });
      }

    } catch (error) {
      console.error("Error in sendMessage:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.data.userId || "unknown"} disconnected`);
  });
});






app.use('/api/v1', userRouter);
app.use('/api/v1', workplaceRoutes);
app.use('/api/v1', serviceRoutes);
app.use('/api/v1', secretariesRoutes);
app.use('/api/v1', subscriptionRoutes);
app.use('/api/v1', billinginformationRoutes);
app.use('/api/v1', systemPreferenceRoutes);
app.use('/api/v1', calenderSettingRouter);
app.use('/api/v1', clientRouter);
app.use('/api/v1', preferenceRouter);
app.use('/api/v1', scheduleRoutes);
app.use('/api/v1', scheduleApointmentRoutes);
app.use('/api/v1', eventRoutes);
app.use('/api/v1', messegeRoutes);
app.use('/api/v1', groupRoutes);
app.use('/api/v1', blogRouter);
app.use('/api/v1', foodsRoutes);
app.use('/api/v1', mealPlan);
app.use('/api/v1', mealTemplate);
app.use('/api/v1', recipe);
app.use('/api/v1', dietarySupplements);
app.use('/api/v1', sendInvite);
app.use('/api/v1', client_Recommendation);
app.use('/api/v1', dailyplan);
app.use('/api/v1', professionalPreference);
app.use('/api/v1', privacyandnotification);
app.use('/api/v1', CommonMeasures);
app.use("/api/v1", lookup);
app.use("/api/v1", foodDiary);
app.use("/api/v1", labTest)
app.use("/api/v1", foodToAvoidTamplate)
app.use("/api/v1", RecommendationTemplate)



app.use(HandleError);
app.use(notFoundMiddleware);

const httpsServer = https.createServer(credentials, app);

server.listen(port, () => {
  ConnectDB();
  console.log(`Server is running at ${port}`);
});


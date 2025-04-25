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
const roleRoutes = require('./routes/Role/roleRoutes');
const permissionRoutes = require('./routes/Role/permissionRoutes');
const userRoleRoutes = require('./routes/Role/userRoleRoutes')
const userPermission = require('./routes/Role/userPermission');
const rolePermission = require('./routes/Role/rolePermission')
const challengeMasterRoutes = require('./routes/Master/challengeMaster');
const masterSimRoutes = require('./routes/Master/MasterSim')
const challenge = require('./routes/Challenge/challeneRoute')
const leaderBoard = require("./routes/Challenge/leaderBoard")
const os = require('os');
const https = require('https');
const fs = require('fs');
const { getPdfData } = require('./controller/user');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const multer = require("./middleware/messageMiddleware");
const cloudinary = require("./db/cloudinary");
const { sendNotification } = require("./firebase/sendNotification");
const { dailyChallengeSnapshot } = require("./cron");
const Challenge = require('./model/Challenge/challenge')
const masterModel = require('./routes/masterModelRoute');
const Client = require("./model/Client");

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
const io = new socketIo.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  }
})

const activeRooms = new Map();
const userSockets = new Map();

function getRoomId(senderId, receiverId) {
  const sortedIds = [senderId, receiverId].sort();
  return sortedIds.join('-');
}

io.on("connection", (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('joinChallengeRoom', ({ challengeId, userId }) => {
    socket.join(challengeId.toString());
    socket.join(userId.toString());
    console.log("📌 User joined challenge & user room");
  });

  socket.on("join", async ({ userId, otherUserId }) => {
    const roomId = getRoomId(userId, otherUserId);
    socket.join(roomId);
    console.log("👥 User joined chat room:", roomId);

    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);

    const unseenMessages = await Message.find({
      senderId: otherUserId,
      receiverId: userId,
      seen: false
    });

    if (unseenMessages.length > 0) {
      const unseenIds = unseenMessages.map(msg => msg._id);

      await Message.updateMany({ _id: { $in: unseenIds } }, { $set: { seen: true } });

      io.to(socket.id).emit("unreadMessages", {
        messageIds: unseenIds,
        messages: unseenMessages
      });

      if (userSockets.has(otherUserId)) {
        userSockets.get(otherUserId).forEach(socketId => {
          io.to(socketId).emit("messagesSeen", {
            messageIds: unseenIds,
            senderId: otherUserId,
            receiverId: userId
          });
        });
      }
    }
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message, file, fcmToken, senderName, tempId }) => {
    try {
      const roomId = getRoomId(senderId, receiverId);

      const lastMessage = await Message.findOne({ roomId }).sort({ createdAt: -1 });

      console.log("🚀 ~ socket.on ~ lastMessage:", lastMessage)
      if (lastMessage && lastMessage.message === message && lastMessage.fileUrl === file) return;

      const socketsInRoom = io.sockets.adapter.rooms.get(roomId) || new Set();
      const isReceiverInRoom = [...socketsInRoom].some(socketId => userSockets.get(receiverId)?.has(socketId));

      console.log("🚀 ~ socket.on ~ isReceiverInRoom:", isReceiverInRoom)

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        fileUrl: file || null,
        roomId,
        seen: isReceiverInRoom,
        tempId
      });

      await newMessage.save();
      console.log("🚀 ~ socket.on ~ newMessage:", newMessage)

      io.to(roomId).emit('receiveMessage', newMessage);
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaa, reacevie")
      io.to(socket.id).emit('messageSent', { ...newMessage.toObject(), tempId });

      // await sendNotification(fcmToken, receiverId, message, senderName);

      if (isReceiverInRoom) {
        console.log("🚀 ~ socket.on ~ isReceiverInRoom:", isReceiverInRoom)
        io.to(roomId).emit("messagesSeen", {
          messageIds: [newMessage._id],
          senderId,
          receiverId
        });
      }

    } catch (error) {
      console.log("❌ Error in sendMessage:", error);
    }
  });

  socket.on("messageSeen", async ({ messageIds, senderId, receiverId }) => {
    try {
      const unseen = await Message.find({
        _id: { $in: messageIds },
        receiverId,
        seen: false
      });

      if (unseen.length > 0) {
        await Message.updateMany(
          { _id: { $in: unseen.map(m => m._id) } },
          { $set: { seen: true } }
        );

        if (userSockets.has(senderId)) {
          userSockets.get(senderId).forEach(socketId => {
            io.to(socketId).emit("messagesSeen", {
              messageIds,
              senderId: receiverId,
              receiverId: senderId
            });
          });
        }
      }
    } catch (error) {
      console.log("❌ Error in messageSeen:", error);
    }
  });

  socket.on("getHistory", async ({ userId, otherUserId }) => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      }).sort({ createdAt: 1 });

      const unseenIds = messages
        .filter(msg => msg.receiverId === userId && !msg.seen)
        .map(msg => msg._id);

      io.to(socket.id).emit("chatHistory", messages);

      if (unseenIds.length > 0) {
        await Message.updateMany({ _id: { $in: unseenIds } }, { $set: { seen: true } });

        io.to(socket.id).emit("messagesSeen", {
          messageIds: unseenIds,
          senderId: otherUserId,
          receiverId: userId
        });

        if (userSockets.has(otherUserId)) {
          userSockets.get(otherUserId).forEach(socketId => {
            io.to(socketId).emit("messagesSeen", {
              messageIds: unseenIds,
              senderId: otherUserId,
              receiverId: userId
            });
          });
        }
      }
    } catch (error) {
      console.log("❌ Error in getHistory:", error);
    }
  });

  socket.on("leave", ({ userId, otherUserId }) => {
    const roomId = getRoomId(userId, otherUserId);
    socket.leave(roomId);
    console.log(`👋 User ${userId} left room ${roomId}`);
  });

  socket.on("logProgressSocket", async ({ userId, value, date }) => {
    console.log("📥 logProgressSocket received");

    try {
      const logDate = date ? new Date(date) : new Date();
      const logDateStr = logDate.toISOString().split('T')[0];

      const client = await Client.findById(userId);
      if (client) {
        const stepLog = client.stepLogs.find(log => log.date === logDateStr);
        if (stepLog) {
          stepLog.steps = value;
        } else {
          client.stepLogs.push({ date: logDateStr, steps: value });
        }
        await client.save();
      }

      const challenges = await Challenge.find({
        participants: { $elemMatch: { clientId: userId, status: 'accepted' } },
        startDate: { $lte: logDate },
        endDate: { $gte: logDate }
      });

      for (const challenge of challenges) {
        const participant = challenge.participants.find(p => p.clientId.toString() === userId);
        if (!participant) continue;

        if (!participant.progress) {
          participant.progress = { total: 0, entries: [] };
        }

        const entry = participant.progress.entries.find(e => e.date === logDateStr);
        if (entry) {
          participant.progress.total -= entry.value;
          entry.value = value;
        } else {
          participant.progress.entries.push({ date: logDateStr, value });
        }

        participant.progress.total += value;

        if (participant.progress.total >= challenge.targetValue && !participant.completedAt) {
          participant.completedAt = logDate;
          participant.earnedCoins = challenge.coinReward;

          await addCoinsToClient({
            clientId: userId,
            coins: challenge.coinReward,
            type: 'challenge_complete',
            description: `Completed challenge: ${challenge.name}`,
            challengeId: challenge._id
          });

          client.coins += challenge.coinReward;
          await client.save();
        }

        await challenge.save();

        io.to(challenge._id.toString()).emit('progressUpdated', {
          challengeId: challenge._id,
          userId,
          total: participant.progress.total,
          entries: participant.progress.entries,
          completedAt: participant.completedAt || null,
          earnedCoins: participant.earnedCoins || 0
        });
      }

    } catch (error) {
      console.error('❌ Error in logProgressSocket:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    let userToRemove = null;

    for (const [userId, socketSet] of userSockets.entries()) {
      if (socketSet.has(socket.id)) {
        socketSet.delete(socket.id);
        if (socketSet.size === 0) userToRemove = userId;
        break;
      }
    }

    if (userToRemove) {
      userSockets.delete(userToRemove);
      console.log(`ℹ️ User ${userToRemove} removed from active sockets`);
    }
  });
});


app.set('io', io);
// dailyChallengeSnapshot(io);
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
app.use('/api/v1', permissionRoutes);
app.use('/api/v1', roleRoutes);
app.use('/api/v1', userRoleRoutes);
app.use('/api/v1', userPermission);
app.use('/api/v1', rolePermission);
app.use('/api/v1/challenge-master', challengeMasterRoutes);
app.use('/api/v1/challenge', challenge)
app.use('/api/v1/leaderboard', leaderBoard)
app.use('/api/v1', masterSimRoutes)
app.use('/api/v1', masterModel)

app.get('/test-daily-challenge-snapshot', async (req, res) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  try {
    const challenges = await Challenge.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    for (const c of challenges) {
      const participants = c.participants.filter(p => p.status === 'accepted');

      participants.forEach(participant => {
        const { clientId, progress } = participant;

        io.to(c._id.toString()).emit('dailyChallengeUpdate', {
          challengeId: c._id,
          userId: clientId,
          date: today,
          total: progress?.total || 0,
          entries: progress?.entries || [],
          completedAt: participant.completedAt || null,
          earnedCoins: participant.earnedCoins || 0
        });

        io.to(clientId.toString()).emit('dailyChallengeUpdate', {
          challengeId: c._id,
          userId: clientId,
          date: today,
          total: progress?.total || 0,
          entries: progress?.entries || [],
          completedAt: participant.completedAt || null,
          earnedCoins: participant.earnedCoins || 0
        });
      });
    }

    res.send("✅ Snapshot triggered and events emitted.");
  } catch (err) {
    console.error("🔥 Error in manual snapshot trigger:", err);
    res.status(500).send("Error occurred");
  }
});






app.use(HandleError);
app.use(notFoundMiddleware);

const httpsServer = https.createServer(credentials, app);

server.listen(port, () => {
  ConnectDB();
  console.log(`Server is running at ${port}`);
});

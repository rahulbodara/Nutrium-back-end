const express = require('express');
require('dotenv').config();
const cors = require('cors');
var path = require('path');
const ConnectDB = require('./db/connection');
const port = 8080 || process.env.PORT;
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
const recipe = require('./routes/recipsInformation');
const recipeCooking = require('./routes/recipsCookingMethod');
const recipeMeasure = require('./routes/recipemeasure');
const dietarySupplements = require('./routes/dietarySupplements');
const ingrediant = require('./routes/ingrediants');
const sendInvite = require('./routes/sendInvitaion');
const client_Recommendation = require('./routes/recommendation')
const dailyplan = require('./routes/dailyplan');
const professionalPreference = require('./routes/professionalpreference');
const privacyandnotification = require('./routes/privacyAndnotification');
const os = require('os');
const https = require('https');
const fs = require('fs');

// // Find the local IP address
const interfaces = os.networkInterfaces();
let localIp = 'localhost'; // Default to localhost if no IP is found

for (const interfaceName of Object.keys(interfaces)) {
  const interfaceInfo = interfaces[interfaceName];
  for (const info of interfaceInfo) {
    if (info.family === 'IPv4' && !info.internal) {
      localIp = info.address;
      break;
    }
  }
}

// Load your SSL/TLS certificates
const privateKeyPath = path.join(__dirname, 'public', 'key.pem');
const certificatePath = path.join(__dirname, 'public', 'cert.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(__dirname+'/uploads'));

// Catch-all route
app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
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
app.use('/api/v1', recipe);
app.use('/api/v1', recipeCooking);
app.use('/api/v1', recipeMeasure);
app.use('/api/v1', dietarySupplements);
app.use('/api/v1', ingrediant);
app.use('/api/v1', sendInvite);
app.use('/api/v1', client_Recommendation);
app.use('/api/v1', dailyplan);
app.use('/api/v1', professionalPreference);
app.use('/api/v1', privacyandnotification);

app.use(HandleError);
app.use(notFoundMiddleware);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, localIp, () => {
  ConnectDB();
  console.log(`Server is running at https://${localIp}:${port}`);
});

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
const os = require('os');

// Find the local IP address
const networkInterfaces = os.networkInterfaces();
const localIp = networkInterfaces['eno1'][0].address;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

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

app.use(HandleError);
app.use(notFoundMiddleware);

app.listen(port, localIp, () => {
  ConnectDB();
  console.log(`Server is running at http://${localIp}:${port}`);
});

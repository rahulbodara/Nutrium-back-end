const express = require('express');
require('dotenv').config();
const cors = require('cors');
const ConnectDB = require('./db/connection');
const port = process.env.PORT;
const workplaceRoutes = require("./routes/workplace");
const serviceRoutes=require("./routes/service")
const secretariesRoutes=require("./routes/secretaries")
const app = express();

const userRouter = require('./routes/user');

ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

app.use('/api/v1', userRouter);
app.use("/api/v1", workplaceRoutes);
app.use("/api/v1", serviceRoutes);
app.use("/api/v1", secretariesRoutes);
app.use((req, res, next) => {
  console.log('HTTP Method - ' + req.method + ',URL - ' + req.url);
  next();
});

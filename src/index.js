const express = require('express');
require('dotenv').config();
const cors = require('cors');
const ConnectDB = require('./db/connection');
const port = process.env.PORT;
const app = express();

const userRouter = require('./routes/userRouter');

ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.use('/api/v1', userRouter);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

app.use((req, res, next) => {
  console.log('HTTP Method - ' + req.method + ',URL - ' + req.url);
  next();
});

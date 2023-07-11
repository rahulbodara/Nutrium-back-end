const express = require('express');
require('dotenv').config();
const cors = require('cors');
const ConnectDB = require('./db/con');
const port = process.env.PORT;

const app = express();
ConnectDB();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

app.use((req, res, next) => {
  console.log('HTTP Method - ' + req.method + ',URL - ' + req.url);
  next();
});

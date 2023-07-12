const express = require("express");
require("dotenv").config();
const cors = require("cors");
const ConnectDB = require("./db/con");
const port = process.env.PORT;
const workplaceRoutes = require("./routes/workplace");
const serviceRoutes=require("./routes/service")

const app = express();

const userRouter = require('./routes/userRouter');

ConnectDB();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

app.use("/api/v1", workplaceRoutes);
app.use("/api/v1", serviceRoutes);
app.use((req, res, next) => {
  console.log("HTTP Method - " + req.method + ",URL - " + req.url);
  next();
});

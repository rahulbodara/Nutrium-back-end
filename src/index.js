const express = require("express");
require("dotenv").config();
const cors = require("cors");
const ConnectDB = require("./db/connection");
const port = 8080 || process.env.PORT;
const bodyParser = require("body-parser");
const workplaceRoutes = require("./routes/workplace");
const subscriptionRoutes = require("./routes/subscription");
const billinginformationRoutes = require("./routes/billinginformation");
const serviceRoutes = require("./routes/service");
const secretariesRoutes = require("./routes/secretaries");
const HandleError = require("./middleware/errorHandler");
const notFoundMiddleware = require("./middleware/not-found");
const systemPreferenceRoutes = require("./routes/systempreference");
const calenderSettingRouter = require("./routes/calendersetting");
const userRouter = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use("/api/v1", userRouter);
app.use("/api/v1", workplaceRoutes);
app.use("/api/v1", serviceRoutes);
app.use("/api/v1", secretariesRoutes);
app.use("/api/v1", subscriptionRoutes);
app.use("/api/v1", billinginformationRoutes);
app.use("/api/v1", systemPreferenceRoutes);
app.use("/api/v1", calenderSettingRouter);

app.use(HandleError);
app.use(notFoundMiddleware);

app.listen(port, () => {
  ConnectDB();
  console.log(`server is running on ${port}`);
});

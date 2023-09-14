require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsConfigs = require("./config/corsConfigs");
const app = express();
const port = process.env.PORT || 3500;

app.use(cors(corsConfigs));
app.use(express.json());
app.use("/2fa", require("./routes/twoFARoutes"));
app.listen(port, () => {
  console.log(`✅ Application running on port: ${port}`);
});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const indexRouter = require("./routes");

mongoose.connect(process.env.DB).then(() => {
  console.log("DATABASE CONNECTED");
});

app.use(morgan("dev")); // Logging middleware
app.use(express.json()); // JSON body parser
app.use(express.static("public")); // Static file serving middleware

app.use("/", indexRouter); // Routing middleware

app.use((err, req, res, next) => {
  err = err ? err.toString() : "Something went wrong";
  res.status(500).json({ msg: err });
  next();
});

app.listen(PORT, () => {
  console.log(`Application running on http://localhost:${PORT}`);
});

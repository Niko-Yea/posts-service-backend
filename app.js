const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// Routes
const photos = require("./routes/photos");
const posts = require("./routes/posts");
const auth = require("./routes/auth");

// DB
const database = require("./config/db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("UploadedFiles"));

// Routes
app.use("/photos", photos);
app.use("/posts", posts);
app.use("/auth", auth);

app.use("/", (req, res, next) => {
  res.send("Hello World!");
});
app.use("/*", (req, res, next) => {
  res.json("404 - Not found ;)");
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});

// LOAD
database.load();

//Start

const PORT = process.env.PORT || 2531;
//listen
app.listen(PORT, () => console.info(`Started on port ${PORT}`));

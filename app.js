const express = require("express");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
// const mysql = require("mysql");

const app = express();

// Passport Config
require("./config/passport")(passport);

//connect mongodb
const db = require("./config/keys").MongoURI;

mongoose.set("strictQuery", false);
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("server run on port: http://localhost:" + PORT));
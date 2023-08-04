const express = require("express");
const morgan = require("morgan");
const routerPosts = require("./routes/postRoutes");
const routerUsers = require("./routes/userRoutes");

const app = express();

//middleware
// app.use(express.static(``));
app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//router
app.use("/api/v1/posts", routerPosts);
app.use("/api/v1/users", routerUsers);

module.exports = app;

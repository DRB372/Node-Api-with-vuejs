const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const indexModel = require("./models/index");

const indexRoutes = require("./routes/index");

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers",'Content-Type,Authorization');
  next();
});
app.use("/api", indexRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});
sequelize.sync().then(result=>{
  app.listen(3000);

}).catch(err=>{
console.log(err);
})

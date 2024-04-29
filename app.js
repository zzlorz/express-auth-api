var createError = require("http-errors");
var express = require("express");
var path = require("path");

var indexRouter = require("./routes/index");
var cors = require("cors");
const jwt = require("jsonwebtoken");
var app = express();
// view engine setup
app.use(
  cors({
    // origin: [
    //   "http://localhost:8080",
    //   "https://www.youlaji.com",
    //   "http://youlaji.com",
    //   "http://api.youlaji.com",
    //   "https://ulikes.top",
    //   "http://ulikes.top",
    //   "http://www.ulikes.top",
    // ],
    origin:'*',
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    alloweHeaders: [
      "Conten-Type",
      "Authorization",
      "request-origin",
      "Cookie",
      "Access-Control-Allow-Origin",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "static")));

const SECRET = "abc@abc";

const asyncAuth = (req, res, next) => {
  console.log(req.path)
  const whiteList = ["/404", "/login", "/signout", "/register"];
  // 获取客户端请求头的token
  const rawToken = String(req.headers.authorization).split(" ").pop();
  const tokenData = jwt.verify(rawToken, SECRET, (error, decoded) => {
    if (error) {
      return "errortoken";
    }
    return decoded;
  });
  if (tokenData != "errortoken") {
    next();
  } else if(whiteList.includes(req.path.split('/v1')[1]) || req.url === "/" || req.url === "/v1/" || req.url === "/v1") {
    next();
  } else {
    res.json({ errcode: 1, msg: "请先登录" });
  }
};
app.all("*", asyncAuth);
app.use("/v1/", indexRouter);
module.exports = app;

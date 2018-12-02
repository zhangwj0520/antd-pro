const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

//1.med 项目路由
const users = require('./routes/api/med/user');
const askPriceList = require('./routes/api/med/list');

//DB config
const db = require('./config/config').mongoURL_zwj;

//Connct to mongodb
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected 数据库连接成功'))
  .catch(err => console.log(err));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //来源的域名和端口号
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization'); //允许的跨域头
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS,DELETE'); //允许的方法
  //如果请求的方法名是OPTIONS的话，则直接结束 请求
  //options探测请求 当客户端发送post请求之后行发送一个options请求，看看服务器支持不支持post请求
  if (req.method == 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    next();
  }
});

//使用body-parser中间件
app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('hello world')
// })
app.use('/med/user', users);
app.use('/med/list', askPriceList);

const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`Server running on port ` + port);
});

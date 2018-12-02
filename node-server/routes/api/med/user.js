// @login &register
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const gravatar = require('gravatar');
const MedUsers = require('../../../module/Med_Users');
const passport = require('passport');

//$route GET api/users/test
//@desc 返回的请求的json数据
//@access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'longin works',
  });
});

//$route POST api/users/register
//@desc 返回的请求的json数据
//@access public
router.post('/register', (req, res) => {
  //查询数据库中是否有该用户
  MedUsers.findOne({
    userName: req.body.userName,
  }).then(user => {
    if (user) {
      return res.status(400).json('邮箱已被注册!');
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      const newUser = new MedUsers({
        userName: req.body.userName,
        avatar,
        passWord: req.body.passWord,
      });
      let md5 = crypto.createHash('md5');
      let newPass = md5.update(newUser.passWord).digest('hex');
      newUser.passWord = newPass;
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    }
  });
});

//$route POST api/users/test
//@desc 返回token jwt passport
//@access public
router.post('/login/account', (req, res) => {
  console.log(req.body);
  const userName = req.body.userName;
  //查询数据库
  MedUsers.findOne({
    userName,
  }).then(user => {
    if (!user) {
      return res.send({ status: 'error', type: req.body.type, currentAuthority: 'guest' });
    }
    //密码匹配
    let md5 = crypto.createHash('md5');
    let newPass = md5.update(req.body.passWord).digest('hex');
    if (newPass === user.passWord) {
      res.send({
        message: '登录成功',
        status: 'ok',
        type: req.body.type,
        currentAuthority: 'admin',
        aaa: 'aaa',
      });
    } else {
      return res.json({ status: 0, message: '密码错误' });
    }
  });
});

//$route POST api/users/current
//@desc 返回token jwt user
//@access private

//rotuer.get('/current', '验证token', (req, res) => {
router.get(
  '/current',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity,
    });
  }
);

module.exports = router;

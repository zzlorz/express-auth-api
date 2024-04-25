const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const supabase = require("../dbconnect/connect");
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
// api接口
router.get("/", function (req, res, next) {
  res.send({ title: "API", version: '1.0' });
});
/*
 * 登录
 * pw: 密码
 * name: 用户名
 */
router.get("/login", async (req, res, next) => {
  const {pw, name} = req.query;
  // const {pw, name} = req.body;
  if(!pw && !name) {
    res.json({ errcode: 1, msg: "用户名或者密码不能为空" });
    return;
  }
  try {
    // 生成token
    const {error, data, count, status, statusText} = await supabase.from("user").select("*").eq('name', name)
    if(data.length>0) {
      // 验证密码
      const isPasswordValid = bcrypt.compareSync(
        pw,
        user.data[0].pw
      )
      if(isPasswordValid) {
        const token = jwt.sign(
          {
            id: String(user.data[0].id)}, 
            process.env.JWT_SECRET, 
            { expiresIn: "2h" }
        );
        res.json({ errcode: 0, data: { token }, msg: "登录成功" });
      }else{
        res.json({ errcode: 0, msg: "用户名或者密码错误" });
      }
    }else{
      res.json({ errcode: 0, msg: "用户名或者密码错误" });
    }       
    return;
  } catch (error) {
    res.send({ errcode: 1, data: error });
    return;
  }
});
/**
 * 注册
 * pw: 密码
 * name: 用户名
*/
router.get("/register", async (req, res, next) => {
  const {pw, name} = req.query;
  if(!pw && !name) {
    res.json({ errcode: 1, msg: "用户名或者密码不能为空" });
    return;
  }
  const {error, data, count, status, statusText} = await supabase.from("user").select("*").eq('name', name)
  if(data.length>0) {
    res.json({ errcode: 1, msg: "用户名已存在" });
    return;
  }
  const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS)
  const hash = bcrypt.hashSync(pw, salt)
  try {
    const user = await supabase
    .from('user')
    .insert({ name: name, pw: hash, created_at: dayjs().format('YYYY-MM-DD HH:mm:ss')});
    res.send({ errcode: 2, data: user });
    return;
  } catch (error) {
    res.send({ errcode: 1, data: error });
    return;
  }
});

module.exports = router;


/* DB_PASSWORD='zhuZHU1989~!#'
SALT_ROUNDS='abc@abc'
JWT_SECRET='abc@abc'
SUPABASE_URL='https://dxzmebuimxtfznmcdwht.supabase.co'
SUPABASE_KEY=`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4em1lYnVpbXh0ZnpubWNkd2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3MzMxMTMsImV4cCI6MjAyODMwOTExM30.
HrTOiN3nsf6EJBcq8nw5ZpO5H23g5OZ8oSN1f-fPq0Q`
*/

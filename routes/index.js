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
    const {error, data, count, status, statusText} = await supabase.from("user").select("*").eq('name', name);
    if(error) {
      res.json({ errcode: 1, msg: "系统错误，登录失败" });
      return
    }
    const {pw: data_pw, id} = data[0];
    if(data.length>0) {
      // 验证密码
      const isPasswordValid = bcrypt.compareSync(
        pw,
        data_pw
      )
      if(isPasswordValid) {
        const token = jwt.sign(
          {
            id: String(id)}, 
            process.env.JWT_SECRET, 
            { expiresIn: "2h" }
        );
        res.json({ errcode: 0, token, msg: "登录成功" });
      }else{
        res.json({ errcode: 0, msg: "用户名或者密码错误" });
      }
    }else{
      res.json({ errcode: 0, msg: "用户名或者密码错误" });
    }       
    // return;
  } catch (error) {
    res.send({ errcode: 1, error});
    // return;
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
  const {error, data, count, status, statusText} = await supabase.from("user").select("*").eq('name', name);
  if(error) {
    res.json({ errcode: 1, msg: "系统错误" });
    return
  }
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

/**
 * 获取主题
 * page: 页码
 * limit: 每页数量
 * */ 
router.get("/theme", async (req, res, next) => {
  const {page, limit} = req.query;
  page = page || 1;
  limit = limit || 10;  
  try {
    let { data: youlaji_blog_test, error } = await supabase.from('youlaji_blog_test').select('*').range((page-1) * limit, page * limit);
    if(error) {
      res.json({ errcode: 1, msg: "系统错误" });
      return
    }
    res.send({ errcode: 2, list: youlaji_blog_test });
    return;
  } catch (error) {
    res.send({ errcode: 1, data: error });
    return;
  }
});
/**
 * 查询主题详情
 * id: 主题id
*/
router.get("/theme/detail", async (req, res, next) => {
  const {id} = req.query;
  try {
    let { data: youlaji_blog_test, error } = await supabase.from('youlaji_blog_test').select('*').eq('id', id);
    if(error) {
      res.json({ errcode: 1, msg: "系统错误" });
      return
    }
    res.send({ errcode: 2, detail: youlaji_blog_test });
    return;
  }catch(error) {
    res.send({ errcode: 1, data: error });
    return;
  }
});
/**
 * 新增主题
 * theme_title: 主题标题
 * theme_description: 主题描述
 * theme_position: 主题位置
 *  theme_date: 主题日期
 * theme_cover: 主题封面
*/
router.post("/theme/add", async (req, res, next) => {
  const {theme_title, theme_description, theme_position, theme_position_detail, theme_date, theme_cover} = req.body;
  try {
    let { data: youlaji_blog_test, error } = await supabase.from('youlaji_blog_test').insert({theme_title: theme_title, theme_description: theme_description, theme_position: theme_position, theme_position_detail: theme_position_detail, theme_date: theme_date, theme_cover: theme_cover}).select();
    if(error) {
      res.json({ errcode: 1, detail: youlaji_blog_test, msg:"系统错误" });
    }
  }catch(error) {
    res.send({ errcode: 1, data: error });
    return;
  }
});
/**
 * 更新单个主题
 * id: 主题id
 * theme_title: 主题标题
 * theme_description: 主题描述
 * theme_position: 主题位置
 *  theme_date: 主题日期
 * theme_cover: 主题封面
*/
router.post("/theme/update", async (req, res, next) => {
  const {id, theme_title, theme_description, theme_position, theme_position_detail, theme_date, theme_cover} = req.body;
  try {
    let { data: youlaji_blog_test, error } = await supabase.from('youlaji_blog_test').update({theme_title: theme_title, theme_description: theme_description, theme_position: theme_position, theme_position_detail: theme_position_detail, theme_date: theme_date, theme_cover: theme_cover}).eq('theme_id', id);
    if(error) {
      res.json({ errcode: 1, msg:"系统错误" });
    }
  }catch(error) {
    res.send({ errcode: 1, data: error });
    return;
  }
});
/**
 * 删除主题（不是物理删除）
*/
router.post("/theme/delete", async (req, res, next) => {
  const {id} = req.body;
  try {
    let { data: youlaji_blog_test, error } = await supabase.from('youlaji_blog_test').update({is_delete: 1}).eq('id', id);
    if(error) {
      res.json({ errcode: 1, msg: "系统错误" });
      return
    }
    res.send({ errcode: 2, detail: youlaji_blog_test});
  }catch(error) {
    res.send({ errcode: 1, data: error });
    return;
  }
});
module.exports = router;


/* DB_PASSWORD='zhuZHU1989~!#'
SALT_ROUNDS='abc@abc'
JWT_SECRET='abc@abc'
SUPABASE_URL='https://dxzmebuimxtfznmcdwht.supabase.co'
SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4em1lYnVpbXh0ZnpubWNkd2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3MzMxMTMsImV4cCI6MjAyODMwOTExM30.HrTOiN3nsf6EJBcq8nw5ZpO5H23g5OZ8oSN1f-fPq0Q'
*/

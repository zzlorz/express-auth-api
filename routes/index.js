const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const postgres = require("postgres");

const SECRET = 'abc@abc';

router.get('/', function(req, res, next) {
    res.send({ title: 'APIS' });
});
/*
 * 登录
 *
*/ 
router.get("/login", async (req, res, next) => {
  const sql = postgres(`postgres://postgres.dxzmebuimxtfznmcdwht:${process.env.DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`)
  const users = await sql`
    select theme_title
    from youlaji_blog_test
    where theme_id = 6
  `;
  console.log(users);
  try {
    // 生成token
    const token = jwt.sign(
      {
        id: String(123),
      },
      SECRET,
      { expiresIn: "2h" }
    );
    res.json({ errcode: 0, data: { token }, msg: "成功" });
    return;
  } catch (error) {
    res.send({ errcode: 1, data: error });
    return;
  }
});

/*
*
*/ 

router.post("/login", async (req, res, next) => {
    try {
        // 生成token
        const token = jwt.sign({
            id: String(123),
        }, SECRET, {expiresIn: '2h'});
        res.json({errcode: 0, data: {token}, msg: '成功'});
        return;
    } catch (error) {
        res.send({errcode: 1, data: error});
        return;
    }
});


module.exports = router;
const sequelize = require('../dbconnect/connect');

// 定义用户模型
class User extends Model {}
User.init({
  username: DataTypes.STRING,
  password: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User'
});

// 同步模型到数据库
sequelize.sync().then(() => {
  // 创建一个新用户
  User.create({
    username: 'johndoe',
    password: 'securepassword'
  }).then(user => console.log(user));
});
const { Sequelize, Model, DataTypes } = require("sequelize");

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  "postgres://postgres.dxzmebuimxtfznmcdwht:${process.env.DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
);
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
module.exports = sequelize;

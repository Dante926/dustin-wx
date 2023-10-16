// pages/personal_informati/personal_informati.js 用户信息
const app = getApp();
// index.js
Page({
  data: {
      username: app.globalData.Username,
      phoneNumber:app.globalData.UserPhone
  },

  changeUsername: function () {
    // 处理修改用户名的逻辑
    // ...
  },

  changePassword: function () {
    // 处理修改密码的逻辑
    // ...
  }
})
// pages/personal_informati/personal_informati.js 用户信息
const app = getApp();
// index.js
Page({
  data: {
    username: app.globalData.Username, //用户名
    phoneNumber: app.globalData.UserPhone, //手机号
    avatarUrl: app.globalData.avatarUrl
  },

  /*页面显示生命周期函数 */
  onShow: function () {
    this.setData({
      username: app.globalData.Username, //用户名
      phoneNumber: app.globalData.UserPhone, //手机号
      avatarUrl: app.globalData.avatarUrl
    })

  },

  changeUsername: function () {
    // 处理修改用户名的逻辑
    // ...
    app.Re_name(app.globalData.UserPhone, "噶大宝");
  },

  changePassword: function () {
    // 处理修改密码的逻辑
    // ...
  }
})
// orders.js  订单管理
const app = getApp();
Page({
  data: {
    localhost:app.globalData.localhost,//本地地址
    orders: app.globalData.orders,//订单信息数组
    flag:false,
    times:3,
    Machine:[0,1,0],
    spending:[0,0,2],
  },

})

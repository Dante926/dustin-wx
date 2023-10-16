// orders.js  订单管理
const app = getApp();
Page({
  data: {
    localhost:app.globalData.localhost,
    orders: app.globalData.orders
  },
  onLoad: function() {
    // 使用定时器，每隔一段时间执行页面重定向
    setInterval(() => {
      if(app.globalData.Flag){
        this.setData({
           orders:app.globalData.orders
        })
      app.globalData.Flag=false;
      }
    }, 1000); // 每1秒刷新一次页面
  }
})

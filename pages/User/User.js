const app = getApp();
const LogsData =require('../../pages/logs/logs.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    login: {
     show: app.globalData.show,
     avatar: "/static/dabao.png",//头像地址
    },
    UserPhone:app.globalData.UserPhone,
    localhost:app.globalData.localhost,
    num:20 //计数值
  },

  // 登录监听
  chooseAvatar(e) {
    if(app.globalData.show == false){
    wx.navigateTo({
      url: '/pages/logs/logs'
     })
    }
  },
  // 基本信息
  basicClick() {
    console.log('基本信息监听');
    if(app.globalData.show==true){
      wx.navigateTo({
        url: '/pages/personal_informati/personal_informati',
      })
    }
    else{
      wx.showToast({
        //反馈
        title: '请登录'
        })

    }
  },
  // 匿名反馈
  feedbackClick() {
    console.log('匿名反馈监听');
  },
  // 订单管理监听
  aboutClick() {
    console.log('订单管理监听');
if(app.globalData.show==true){
  wx.request({
    method: 'POST',
    url: this.data.localhost+'/getorderlist',
    data: {
         Phone:app.globalData.UserPhone//根据手机号搜索
    },
     /*读取数据库信息*/
  success :(res) => {
    console.log(res);
    console.log("数组长度为："+res.data.length);//显示数组长度
    for (let i =res.data.length; i>0; i--) {
      app.globalData.orders.push(
      {
      State:res.data[i-1].status_bar,
      orderNumber:res.data[i-1].orderld,
      startTime:res.data[i-1].startime,
      endTime:res.data[i-1].endtime,
      paymentAmount:res.data[i-1].mone,
      estimatedChargeDuration:res.data[i-1].Timer,
      siteName:res.data[i-1].Site,
      siteNumber:res.data[i-1].End,
      portNumber:res.data[i-1].COM
    }
        );
        console.log(i);
      // 循环体的操作
    } 
      console.log(app.globalData.orders);
    app.globalData.Flag=true;
  },
    fail: function () {//没有获取到值，说明这中间出问题了。
      console.log("获取失败");
    }
  });
    wx.navigateTo({
      url: '/pages/order_information/order_information',
    })

  }
  },
  // 退出登录
  exitClick(e) {
    let that = this;
if (this.data.login.show==true) {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          app.globalData.show=false,
          app.globalData.UserPhone=0,
          app.globalData.Usermone=0,
        that.setData({
            login: {
              show:false,
              avatar: "/static/dabao.png",
            }
          }) 
        }        
      }
    })
  } 
  else {
wx.navigateTo({
  url: '/pages/logs/logs'
 });
 this.setData({
  login: {
    //show: true,
    avatar: "/static/dabao.png",
  }
})
  }
  },
 Returnindx(){
    wx.switchTab({
      url: '/pages/index/index'
});
  },
  getData(){
    this.setData({
      login: {
     show:app.globalData.show,
      },
     UserPhone:app.globalData.UserPhone
    })

  },

  onLoad(options) {
    // 初始化页面加载
    this.getData();
    // 每隔一段时间自动重新加载页面
    setInterval(() => {
      this.getData();
    }, 1000); // 每隔5秒重新加载一次页面
  },
})


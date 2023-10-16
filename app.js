// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
      }
    })
          wx.navigateTo({
            url: '/pages/logs/logs'
          })
  },
  globalData: {//全局数据存储区
    localhost:'http://127.0.0.1:3000',
    Username:'NewUser',///用户名
    UserPhone:0,//账户
    show:false,//登录状态
    Flag:false,//页面是否需要更新标志
    Usermone:0, //余额
    year:0, month:0, day:0, hours:0, minutes:0 ,seconds:0 ,// 年月日时分
    Onstaic:false,//是否充电的标志位
    
    /*正在运行的订单信息开始*/
       countdownSeconds: 0,//计算数值，秒为单位
        State: null,//订单状态
        orderNumber: null,//订单编号
        startTime: null,//开始时间
        endTime: null,//结束时间
        paymentAmount:null,//支付金额
        estimatedChargeDuration:null,//预计时长
        siteName:null,//站点名称
        siteNumber: null,//设备编号
        portNumber: null,//端口号

        /*正在运行的订单信息结束*/

    orders:[//存取用户订单专用
    /*  {
        status: '充电中',
        State: '0',
        orderNumber: '1234567890',
        startTime: '2023-01-01 10:00:00',
        endTime: '2023-01-01 11:30:00',
        paymentAmount: '10.00',
        estimatedChargeDuration: '90分钟',
        siteName: '充电站A',
        siteNumber: 'A001',
        portNumber: '01'
      }*/
    ]
  },
  redmone: function (UserPhone,Timer,MQTT_target){
    wx.request({
    method: 'POST',
    url:this.globalData.localhost+'/redmone',
    data: {
    Mone:Timer,
    Phone:UserPhone
    },
     /*读取数据库信息*/
  success :(res) => {
    console.log(res);
    console.log(MQTT_target+"充电"+(Timer)*3+"小时"+"成功");
  },
    fail: function () {//没有获取到值，说明这中间出问题了。
      console.log("获取失败");
    }
  })
  },
  Logs: function (UserPhone,UserPasswd){
  wx.request({
      method: 'POST',
      url:this.globalData.localhost+'/Logs',
      data: {
           Phone:UserPhone//根据手机号搜索
      },
       /*读取数据库信息*/
    success :(res) => {
      console.log(res);
      console.log(res.data[0]);//输出密码
     const Getpassw = res.data[0].passwd;
      if(Getpassw==UserPasswd) 
      {
         this.globalData.UserPhone =UserPhone;//更新账户
         this.globalData.show=true;//修改登陆状态
         this.globalData.Flag=true;//修改刷新标记
         console.log(this.globalData.UserPhone);//打印账号
      //   console.log('运行到这儿了'); 
         wx.switchTab({
          url: '/pages/User/User'
         });
        }
        else{
          console.log("登陆失败，提示：账号或密码错误");
          wx.showToast({//登录反馈
            title: '账号或密码错误'
            })
        }
    },
      fail: function () {//没有获取到值，说明这中间出问题了。
        console.log("获取失败");
      }
    });
  }
  
  
})


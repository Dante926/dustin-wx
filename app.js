// app.js
//const moment = require('/node_modules/moment/moment.js');

const moment = require('moment');
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {}
    })
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },
  globalData: { //全局数据存储区
    localhost: 'http://127.0.0.1:3000', //不使用局域网的时候用这个
    //   localhost:'http://192.168.70.28:3000',  //当真机调试时使用局域网，连接同一个局域网然后查看并使用电脑IP地址
    Username: 'NewUser', ///用户名
    UserPhone: null, //账户
    show: false, //登录状态
    Flag: false, //页面是否需要更新标志
    Usermone: 0, //余额
    year: 0,
    month: 0,
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0, // 年月日时分
    Onstaic: false, //是否充电的标志位

    SocketCountt: 0,
    /*正在运行的订单信息开始*/
    countdownSeconds: 0, //计算数值，秒为单位
    State: null, //订单状态
    orderNumber: null, //订单编号
    startTime: null, //开始时间
    endTime: null, //结束时间
    paymentAmount: null, //支付金额
    estimatedChargeDuration: null, //预计时长
    siteName: null, //站点名称
    siteNumber: null, //设备编号
    portNumber: null, //端口号
    MQTT_pro: null, //MQTT指令端口
    voltage1: '--', //电压
    electricity1: '--', //电流
    electric_power1: '--', //电功率
    voltage4: '--', //电压
    electricity4: '--', //电流
    electric_power4: '--', //电功率

    voltage: '--', //电压
    electricity: '--', //电流
    electric_power: '--', //电功率
    /*正在运行的订单信息结束*/

    orders: [ //存取用户订单专用
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
  //充电后修改金额
  redmone: function (UserPhone, Timer, MQTT_target) {
    wx.request({
      method: 'POST',
      url: this.globalData.localhost + '/redmone',
      data: {
        Mone: Timer,
        Phone: UserPhone
      },
      /*读取数据库信息*/
      success: (res) => {
        console.log(res);
        console.log(MQTT_target + "充电" + (Timer) * 3 + "小时" + "成功");
      },
      fail: function () { //没有获取到值，说明这中间出问题了。
        console.log("获取失败");
      }
    })
  },
  //登录接口
  Logs: function (UserPhone, UserPasswd) {
    wx.request({
      method: 'POST',
      url: this.globalData.localhost + '/Logs',
      data: {
        Phone: UserPhone //根据手机号搜索
      },
      /*读取数据库信息*/
      success: (res) => {
        console.log(res);
        console.log(res.data[0]); //输出密码
        const Getpassw = res.data[0].passwd;
        if (Getpassw == UserPasswd) {
          this.globalData.UserPhone = UserPhone; //更新账户
          this.globalData.show = true; //修改登陆状态
          this.globalData.Flag = true; //修改刷新标记
          console.log(this.globalData.UserPhone); //打印账号
          //   console.log('运行到这儿了'); 
          wx.switchTab({
            url: '/pages/User/User'
          });
        } else {
          console.log("登陆失败，提示：账号或密码错误");
          wx.showToast({ //登录反馈
            title: '账号或密码错误'
          })
        }
      },
      fail: function () { //没有获取到值，说明这中间出问题了。
        console.log("获取失败");
      }
    });
  },
  //修改用户名
  Re_name: function (UserPhone, NewNane) {
    wx.request({
      method: 'POST',
      url: this.globalData.localhost + '/ReNane',
      data: {
        Phone: UserPhone,
        Nane: NewNane
      },
      /*读取数据库信息*/
      success: (res) => {
        console.log(res);
        if (res.data.message == 'ReName_success') {
          console.log(res.data.messag)
          wx.showToast({
            title: '修改成功',
          })
        }
      },
      fail: function () { //没有获取到值，说明这中间出问题了。
        console.log("获取失败");
      }
    })

  },
  //获取订单数据
  get_order: function (UserPhone) {
    const datetime = '';
    wx.request({
      method: 'POST',
      url: this.globalData.localhost + '/getorderlist',
      data: {
        Phone: this.globalData.UserPhone //根据手机号搜索
      },
      /*读取数据库信息*/
      success: (res) => {
        console.log(res);
        console.log("查询到订单数组长度为：" + res.data.length); //显示数组长度
        this.globalData.orders.splice(0, this.globalData.orders.length);
        for (let i = res.data.length; i > 0; i--) {
          this.globalData.orders.push({
            State: res.data[i - 1].status_bar,
            orderNumber: res.data[i - 1].orderld,
            startTime: moment(res.data[i - 1].startime).format('YYYY-MM-DD HH:mm:ss'),
            //endTime:res.data[i-1].endtime,
            endTime: moment(res.data[i - 1].endtime).format('YYYY-MM-DD HH:mm:ss'),
            paymentAmount: res.data[i - 1].mone,
            estimatedChargeDuration: res.data[i - 1].Timer,
            siteName: res.data[i - 1].Site,
            siteNumber: res.data[i - 1].SEnd,
            portNumber: res.data[i - 1].COM
          });
          // 循环体的操作
        }

        console.log(this.globalData.orders);
        this.globalData.Flag = true;
      },
      fail: function () { //没有获取到值，说明这中间出问题了。
        console.log("获取失败");
      }
    });

  },
  //启动订单信息写入
  Start_order: function (UserPhone) {
    wx.request({
      method: 'POST',
      url: this.globalData.localhost + '/InStar',
      data: {
        Phone: this.globalData.UserPhone, //根据手机号搜索
        startime: this.globalData.startTime, //启动时间,
        Site: this.globalData.siteName,
        End: this.globalData.siteNumber,
        COM: this.globalData.portNumber,
        mone: this.globalData.paymentAmount,
        Timer: this.globalData.estimatedChargeDuration
      },
      /*读取数据库信息*/
      success: (res) => {
        console.log(res);
        if (res.data.message == 'Start_success') {
          console.log(res.data.messag)
          wx.showToast({
            title: '启动成功',
          })
        }
      },
      fail: function () { //没有获取到值，说明这中间出问题了。
        console.log("获取失败");
      }
    })


  },
  //结束订单写入
  Stop_order: function (UserPhone) {
    wx.request({
      method: 'POST',
      url: this.globalData.localhost + '/Stop',
      data: {
        Phone: this.globalData.UserPhone, //根据手机号搜索
        Stoptime: this.globalData.endTime, //启动时间,
        COM: this.globalData.portNumber,
        End: this.globalData.siteNumber

      },
      /*读取数据库信息*/
      success: (res) => {
        console.log(res);
        if (res.data.message == 'Stop_orderlist') {
          console.log(res.data.messag)
          wx.showToast({
            title: '订单结束',
          })
        }
      },
      fail: function () { //没有获取到值，说明这中间出问题了。
        console.log("获取失败");
      }
    })


  }
})
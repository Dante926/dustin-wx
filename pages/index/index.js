// index.js
// 获取应用实例
const app = getApp()
/* const {connect}  =require('../../utils/mqtt')
const mqttHost='www.litaihua.site'//mqtt服务器域名
const mqttPort=8084//mqtt端口号
const deviceSubTopic='dustin'//设备订阅Topic（小程序发布命令的Topic）
const devicePubTopic='sway'//设备发布Topic（小程序订阅数据的Topic）
const mpSuTopic = devicePubTopic;//发
const mpPuTopic = deviceSubTopic;//收 */

Page({
  data: {
    // Dante -----------------------
    // 可管理设备号
    manage_eq_id: '',

    // 用户权限变量
    power: '',

    // 取纸设备号
    pickup_id: 1,
    pikupoptions: [1, 2],

    //是否启用取纸机
    paperMachineEnabled: false, //默认关闭

    // 收费模式
    chargeModeEnabled: false, //默认关闭

    // 收费金额
    mone: 1,
    moneOptions: [1, 2, 3, 4],

    // 出纸频率
    frequency: 3,
    frequencyOptions: [3, 6, 9],

    // 剩余容量
    total: '',

    //End---------------------------

    localhost: app.globalData.localhost,
    currentTime: '', //实时时间
    current: 3,
    client: null,
    /*MQTT下发数据 */
    MQTT_target: "NULL", //MQTT下发的编号 COMx
    Timer: 0, //充电时长选择
    /*COM口状态，0为可用，1为占用，2为禁用 */
    //终端1
    End1_COM_State: 0,
    End1_COM1_State: 0,
    End1_COM2_State: 0,
    End1_COM3_State: 0,
    //终端2
    End2_COM_State: 0,
    End2_COM1_State: 0,
    End2_COM2_State: 0,
    End2_COM3_State: 0,

    /*是否选择端口，选中为true，否则为false*/
    COM_Chose: 'NULL',
    End_Chose: 'NULL',
    End1_COM1_Chose: false,
    End1_COM2_Chose: false,
    End1_COM3_Chose: false,

    End2_COM1_Chose: false,
    End2_COM2_Chose: false,
    End2_COM3_Chose: false,
    /*是否选择充电金额，选中为true，否则为false*/
    Timer_Chose: 0,
    Timer1_Chose: false,
    Timer2_Chose: false,
    Timerx_Chose: false,
    TimeCount: 0
  },

  /*COM选择开始*/
  onCOM1Change: function (e) { //COM1选择
    const that = this
    if (this.data.End1_COM1_Chose) {
      that.setData({
        End1_COM1_Chose: false,
        MQTT_target: "NULL"
      })
    } else {
      that.setData({
        End1_COM1_Chose: true,
        End1_COM2_Chose: false,
        End1_COM3_Chose: false,
        End2_COM1_Chose: false,
        End2_COM2_Chose: false,
        End2_COM3_Chose: false,
        MQTT_target: "COM1"
      })
    }
    console.log('已选择' + this.data.MQTT_target + '端口');
    that.setData({
      COM_Chose: 1,
      End_Chose: 'A'
    })
  },
  onCOM2Change(event) { //COM2选择
    const that = this
    if (this.data.End1_COM2_Chose) {
      that.setData({
        End1_COM2_Chose: false,
        MQTT_target: "NULL"
      })
    } else {
      that.setData({
        End1_COM2_Chose: true,
        End1_COM1_Chose: false,
        End1_COM3_Chose: false,
        End2_COM1_Chose: false,
        End2_COM2_Chose: false,
        End2_COM3_Chose: false,
        MQTT_target: "COM2"
      })
    }
    console.log('已选择' + this.data.MQTT_target + '端口');
    that.setData({
      COM_Chose: 2,
      End_Chose: 'A'
    })
  },
  onCOM3Change(event) { //COM3选择
    const that = this
    that.setData({
      MQTT_target: "COM3"
    })
    if (this.data.End1_COM3_Chose) {
      that.setData({
        End1_COM3_Chose: false,
        MQTT_target: "NULL"
      })
    } else {
      that.setData({
        End1_COM3_Chose: true,
        End1_COM1_Chose: false,
        End1_COM2_Chose: false,
        End2_COM1_Chose: false,
        End2_COM2_Chose: false,
        End2_COM3_Chose: false,
        MQTT_target: "COM3"
      })
    }
    console.log('已选择' + this.data.MQTT_target + '端口');
    that.setData({
      COM_Chose: 3,
      End_Chose: 'A'
    })
  },
  onCOM4Change(event) { //COM4选择
    const that = this
    if (this.data.End2_COM1_Chose) {
      that.setData({
        End2_COM1_Chose: false,
        MQTT_target: "NULL"
      })
    } else {
      that.setData({
        End2_COM1_Chose: true,
        End2_COM3_Chose: false,
        End2_COM2_Chose: false,
        MQTT_target: "COM4",
        End1_COM1_Chose: false,
        End1_COM2_Chose: false,
        End1_COM3_Chose: false
      })
    }
    console.log('已选择' + this.data.MQTT_target + '端口');
    that.setData({
      COM_Chose: 4,
      End_Chose: 'B'
    })
  },
  onCOM5Change(event) { //COM5选择
    const that = this
    if (this.data.End2_COM2_Chose) {
      that.setData({
        End2_COM2_Chose: false,
        MQTT_target: "NULL"
      })
    } else {
      that.setData({
        End2_COM2_Chose: true,
        End2_COM1_Chose: false,
        End2_COM3_Chose: false,
        End1_COM1_Chose: false,
        End1_COM2_Chose: false,
        End1_COM3_Chose: false,
        MQTT_target: "COM5"
      })
    }
    console.log('已选择' + this.data.MQTT_target + '端口');
    that.setData({
      COM_Chose: 5,
      End_Chose: 'B'
    })
  },
  onCOM6Change(event) { //COM选择
    const that = this
    if (this.data.End2_COM3_Chose) {
      that.setData({
        End2_COM3_Chose: false,
        MQTT_target: "NULL"
      })
    } else {
      that.setData({
        End2_COM3_Chose: true,
        End2_COM1_Chose: false,
        End2_COM2_Chose: false,
        End1_COM1_Chose: false,
        End1_COM2_Chose: false,
        End1_COM3_Chose: false,
        MQTT_target: "COM6"
      })
    }
    console.log('已选择' + this.data.MQTT_target + '端口');
    that.setData({
      COM_Chose: 6,
      End_Chose: 'B'
    })
  },

  /*时长选择结束*/
  /*充电指令下发任务开始*/
  OnStart(event) {
    const that = this;
    if (app.globalData.show == true) { //判断是否登录
      // if(app.globalData.show == true||app.globalData.show == false ){//调试用
      if (that.data.MQTT_target != "NULL" && that.data.Timer != 0) { //端口不为空，且时长不为0...
        wx.showModal({
          title: '当前选择',
          content: '站点' + this.data.End_Chose + ' ' + '端口' + this.data.COM_Chose + '  ' + this.data.Timer * 4 + '小时',
          complete: (res) => {
            if (res.confirm) {
              if (app.globalData.Usermone >= that.data.Timer) { //余额充足
                //   if(app.globalData.Usermone<=that.data.Timer){//调试用
                that.data.client.publish(mpPuTopic, JSON.stringify({ //MQTT发送消息
                    target: that.data.MQTT_target,
                    value: that.data.Timer,
                  }),
                  function (err) {
                    if (!err) {
                      console.log('成功下达指令充电');
                      app.globalData.SocketCountt = app.globalData.SocketCountt + 1;
                      app.globalData.Onstaic = true; //充电状态置1
                      app.redmone(app.globalData.UserPhone, that.data.Timer, that.data.MQTT_target); //数据库修改金额
                      /*订单数据更新区--开始*/
                      app.globalData.countdownSeconds = that.data.Timer * 4 * 60 * 60; //计时时间 /秒
                      app.globalData.startTime = `${app.globalData.year}-${app.globalData.month}-${app.globalData.day} ${app.globalData.hours}:${app.globalData.minutes}:${app.globalData.seconds}`; //开始时间
                      app.globalData.endTime = 'NULL'; //结束时间
                      app.globalData.paymentAmount = that.data.Timer_Chose; //支付金额元
                      app.globalData.Usermone = app.globalData.Usermone - that.data.Timer_Chose;
                      app.globalData.estimatedChargeDuration = that.data.Timer_Chose * 4 * 60; //预计时长/分钟
                      if (that.data.COM_Chose == 1) {
                        app.globalData.siteName = '充电站A'; //站点名称
                        app.globalData.siteNumber = 'A001'; //设备编号
                        app.globalData.portNumber = 'COM1'; //端口号
                        app.globalData.MQTT_pro = 'COM1'; //端口号
                        app.globalData.voltage = app.globalData.voltage1;
                        app.globalData.electricity = app.globalData.electricity1;
                        app.globalData.electric_power = app.globalData.electric_power1;
                        that.setData({
                          End1_COM1_Chose: false
                        })
                      } else if (that.data.COM_Chose == 2) {
                        app.globalData.siteName = '充电站A'; //站点名称
                        app.globalData.siteNumber = 'A001'; //设备编号
                        app.globalData.portNumber = 'COM2'; //端口号
                        app.globalData.MQTT_pro = 'COM2'; //端口号
                        app.globalData.voltage = "--";
                        app.globalData.electricity = "--";
                        app.globalData.electric_power = "--";
                        that.setData({
                          End1_COM2_Chose: false
                        })
                      } else if (that.data.COM_Chose == 3) {
                        app.globalData.siteName = '充电站A'; //站点名称
                        app.globalData.siteNumber = 'A001'; //设备编号
                        app.globalData.portNumber = 'COM3'; //端口号
                        app.globalData.MQTT_pro = 'COM3'; //端口号
                        app.globalData.voltage = "--";
                        app.globalData.electricity = "--";
                        app.globalData.electric_power = "--";
                        that.setData({
                          End1_COM3_Chose: false
                        })
                      } else if (that.data.COM_Chose == 4) {
                        app.globalData.siteName = '充电站B'; //站点名称
                        app.globalData.siteNumber = 'A002'; //设备编号
                        app.globalData.portNumber = 'COM1'; //端口号
                        app.globalData.MQTT_pro = 'COM4';
                        app.globalData.voltage = app.globalData.voltage4;
                        app.globalData.electricity = app.globalData.electricity4;
                        app.globalData.electric_power = app.globalData.electric_power4;
                        that.setData({
                          End2_COM1_Chose: false
                        })
                      } else if (that.data.COM_Chose == 5) {
                        app.globalData.siteName = '充电站B'; //站点名称
                        app.globalData.siteNumber = 'A002'; //设备编号
                        app.globalData.portNumber = 'COM2'; //端口号
                        app.globalData.MQTT_pro = 'COM5';
                        app.globalData.voltage = "--";
                        app.globalData.electricity = "--";
                        app.globalData.electric_power = "--";
                        that.setData({
                          End2_COM2_Chose: false
                        })
                      } else if (that.data.COM_Chose == 6) {
                        app.globalData.siteName = '充电站B'; //站点名称
                        app.globalData.siteNumber = 'A002'; //设备编号
                        app.globalData.portNumber = 'COM3'; //端口号
                        app.globalData.MQTT_pro = 'COM6';
                        app.globalData.voltage = "--";
                        app.globalData.electricity = "--";
                        app.globalData.electric_power = "--";
                        that.setData({
                          End2_COM3_Chose: false
                        })
                      }
                      if (that.data.Timer1_Chose) {
                        that.setData({
                          Timer1_Chose: false
                        })
                      } else if (that.data.Timer2_Chose) {
                        that.setData({
                          Timer2_Chose: false
                        })
                      } else if (that.data.Timerx_Chose) {
                        that.setData({
                          Timerx_Chose: false
                        })
                      }

                      /*订单数据更新区--结束*/
                      /*订单开启数据库写入 */
                      app.Start_order(app.globalData.UserPhone)

                      wx.navigateTo({
                        url: '/pages/countdowm/countdowm',
                      })
                    } else {
                      console.log('启动失败。MQTT链接出问题')
                      wx.showModal({
                        title: '错误',
                        content: '网络连接失败'
                      })
                    }
                  })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '余额不足，请充值',
                })
              }

            }
          }
        })
      } else {
        wx.showToast({
          //反馈
          title: '请选端口及时长'
        })
      }
    } //success
    //判断登录结束
    else { //假如没有登录
      wx.showModal({ //再次确认是否充值
        title: '提示',
        content: '当前未登录，是否登录？',
        success: (res) => {
          if (res.confirm) { //假如确定
            wx.navigateTo({
              url: '/pages/logs/logs',
            })
          }
        }
      }) //弹框结束
    } //else 结束
  },
  /*充电指令任务结束*/
  GetMQTT_Data() {},
  /*数据变化页面跳转*/
  Jump: function (e) {
    wx.navigateTo({
      url: '/pages/fetch/fetch',
    });
  },
  open: function (e) {
    wx.navigateTo({
      url: '/pages/fetch02/fetch02',
    });
  },
  onLoad() {},

  // MQTT数据上传接收处理
  onShow: async function () {

    const that = this;
    that.setData({
      client: connect(`wxs://${mqttHost}:${mqttPort}/mqtt`)
    });
    that.data.client.on('end', () => {
      console.log('MQTT connection ended');
    });
    that.data.client.on('connect', async function (params) {
      app.globalData.SocketCountt = app.globalData.SocketCountt + 1;
      console.log('成功连接到MQTT服务器');
      await that.data.client.subscribe(mpSuTopic);
      console.log('成功订阅设备上行数据Topic');
    });
    this.getCurrentTime();
    const processMessage = async (topic, message) => {
      let dataFromDev = {};
      try {
        dataFromDev = JSON.parse(message);
        console.log(topic, dataFromDev);
        that.setData({
          End1_COM1_State: dataFromDev.COM1,
          End1_COM2_State: dataFromDev.COM2,
          End1_COM3_State: dataFromDev.COM3,
          End2_COM1_State: dataFromDev.COM4,
          End2_COM2_State: dataFromDev.COM5,
          End2_COM3_State: dataFromDev.COM6,
          End1_COM_State: dataFromDev.End1,
          End2_COM_State: dataFromDev.End2,
          TimeCount: 0
        });

        app.globalData.voltage1 = dataFromDev.V1 / 10;
        app.globalData.electricity1 = dataFromDev.E1 / 1000;
        app.globalData.electric_power1 = dataFromDev.P1 / 10;
        app.globalData.voltage4 = dataFromDev.V4 / 10;
        app.globalData.electricity4 = dataFromDev.E4 / 1000;
        app.globalData.electric_power4 = dataFromDev.P4 / 10;

        if (that.data.End1_COM_State === 0) {
          that.setData({
            End1_COM1_State: 2,
            End1_COM2_State: 2,
            End1_COM3_State: 2
          });
        }

        if (that.data.End2_COM_State === 0) {
          that.setData({
            End2_COM1_State: 2,
            End2_COM2_State: 2,
            End2_COM3_State: 2
          });
        }
      } catch (error) {
        console.log('JSON错误', error);
      }
    };
    that.data.client.on('message', async function (topic, message) {
      await processMessage(topic, message);
    });
  },

  /*获取实时时间 */
  getCurrentTime: function () { //获取并更新时间函数

    setInterval(() => { //定时器计时，每秒更新时间一次
      const now = new Date(); //获取数据
      const year = now.getFullYear(); //年
      const month = this.formatNumber(now.getMonth() + 1); //月
      const day = this.formatNumber(now.getDate()); //日
      const hours = this.formatNumber(now.getHours()); //时、24小时制
      const minutes = this.formatNumber(now.getMinutes()); //分
      const seconds = this.formatNumber(now.getSeconds()); //秒
      const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; //整合时间数据
      /*存储当前获取的数据到全局*/
      app.globalData.year = year;
      app.globalData.month = month;
      app.globalData.day = day;
      app.globalData.hours = hours;
      app.globalData.minutes = minutes;
      app.globalData.seconds = seconds;
      /*存储当前获取的数据到全局代码段结束*/
      this.setData({
        currentTime,
        TimeCount: this.data.TimeCount + 1,
      });
    }, 1000);
  },
  formatNumber: function (num) {
    return num < 10 ? '0' + num : num;
  },
  /*获取实时时间代码段结束 */
}, )
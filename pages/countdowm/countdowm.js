const app = getApp()
const {connect}  =require('../../utils/mqtt')
const mqttHost='www.litaihua.site'//mqtt服务器域名
const mqttPort=8084//mqtt端口号
const deviceSubTopic='/ldd/sub'//设备订阅Topic（小程序发布命令的Topic）
const devicePubTopic='/ldd/pub'//设备发布Topic（小程序订阅数据的Topic）
const mpSuTopic = devicePubTopic;//发
const mpPuTopic = deviceSubTopic;//收


Page({
  data: {
    client:null,
    localhost:app.globalData.localhost,
    time: '00:00:00',//显示格式 时：分：秒
    countdownInterval: null,//
    countdownSeconds: app.globalData.countdownSeconds,//计算数值，秒为单位
    animate: true,//
    /*订单详细参数区域-开始*/
      State:app.globalData.State,
      orderNumber:app.globalData.orderNumberapp,
      startTime:app.globalData.startTime,
      endTime:app.globalData.endTime,
      paymentAmount:app.globalData.paymentAmount,
      estimatedChargeDuration:app.globalData.estimatedChargeDuration,
      siteName:app.globalData.siteName,
      siteNumber:app.globalData.siteNumber,
      portNumber:app.globalData.portNumber
      /*订单详细参数区域-结束*/
   
  },

  onShow: function() 
  {//开始计时函数
    var that = this;
    var seconds = app.globalData.countdownSeconds;
    if (seconds <= 0) 
    { // 如果倒计时时间小于等于0，则忽略点击事件
      return;
    }
    this.setData({
      countdownInterval: setInterval(function() {
        seconds--;
        app.globalData.countdownSeconds=seconds;
        var timeString = that.formatTime(seconds);
        that.setData({
          time: timeString,
          animate: true
        });
        if (seconds <= 0) { // 当倒计时结束时，清除定时器
          clearInterval(that.data.countdownInterval);
          app.globalData.countdownSeconds=0;
          that.setData({
            countdownInterval: null,
            time: '00:00:00',
            animate: false
          });
        }
      }, 1000),
      State:app.globalData.State,
      startTime:app.globalData.startTime,
      endTime:app.globalData.endTime,
      paymentAmount:app.globalData.paymentAmount,
      estimatedChargeDuration:app.globalData.estimatedChargeDuration,
      siteName:app.globalData.siteName,
      siteNumber:app.globalData.siteNumber,
      portNumber:app.globalData.portNumber
    });

  },

  formatTime: function(seconds) {
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor((seconds - hour * 3600) / 60);
    var second = seconds - hour * 3600 - minute * 60;
    return this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
  },

  addZero: function(num) {
    return num < 10 ? '0' + num : num;
  },

  /*充电指令下发任务开始*/ 
OnStop(event){
  const that = this;
  client: connect(`wxs://${mqttHost}:${mqttPort}/mqtt`)
  if(app.globalData.Onstaic == true){//判断是否正在充电
    wx.showModal({
    title: '提示',
    content: '确定结束充电吗？',
    success(res) {//确定结束
     that.data.client.publish(mpPuTopic,JSON.stringify
        ({//MQTT发送消息
        target:app.globalData.portNumber,//充电端口号
        value:0,//此时Timer应该为0
      }),
      function (err) {
          if (!err) {console.log('成功下达指令结束充电') ; 
          app.globalData.Onstaic=false;//充电状态置0
        }
        else{
          console.log('关闭失败，MQTT链接出问题')
        }
      })
  
  }
})
  

}//success
  //判断登录结束
  else{ //假如没有登录
    wx.showModal({//再次确认是否充值
      title: '提示',
      content: '当前未登录，是否登录？',
      success :(res) => {
        if (res.confirm) {//假如确定
       wx.navigateTo({
         url: '/pages/logs/logs',
       })
            }
          }
  })//弹框结束
}//else 结束
},/*充电指令任务结束*/ 
})
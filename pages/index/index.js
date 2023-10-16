// index.js
// 获取应用实例
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
  localhost:app.globalData.localhost,
  currentTime: '',//实时时间
   client:null,
   /*MQTT下发数据 */
   MQTT_target:"NULL",//MQTT下发的编号 COMx
   Timer:0,//充电时长选择
   /*COM口选择 */
   COM1:"COM1",
   COM2:"COM2",
   COM3:"COM4",
   COM4:"COM5",
   /*COM口状态，0为可用，1为占用，2为禁用 */
   COM1_State:0,
   COM2_State:0,
   COM3_State:0,
   COM4_State:0,
   /*是否选择端口，选中为true，否则为false*/
   COM_Chose:'NULL',
   COM1_Chose:false,
   COM2_Chose:false,
   COM3_Chose:false,
   COM4_Chose:false,
  /*是否选择充电金额，选中为true，否则为false*/
   Timer_Chose:0,
   Timer1_Chose:false,
   Timer2_Chose:false,
   Timerx_Chose:false,
  },
  /*COM选择开始*/ 
  onCOM1Change:function(e){ //COM1选择
    const that =this
    if(this.data.COM1_Chose){that.setData( { COM1_Chose:false, MQTT_target:"NULL"}) }
    else{ that.setData({COM1_Chose:true,COM2_Chose:false,
      COM3_Chose:false,COM4_Chose:false, MQTT_target:"COM1"})}
    console.log(this.data.MQTT_target);
    console.log(this.data.COM1_Chose);
    that.setData({
      COM_Chose:1
    })
  },
  onCOM2Change(event){//COM2选择
    const that =this
    if(this.data.COM2_Chose){that.setData( { COM2_Chose:false,MQTT_target:"NULL" }) }
    else{ that.setData({COM2_Chose:true,COM1_Chose:false,
      COM3_Chose:false,COM4_Chose:false,MQTT_target:"COM2"})}
    console.log(this.data.MQTT_target);
    console.log(this.data.COM2_Chose);
    that.setData({
      COM_Chose:2
    })
  },
  onCOM3Change(event){//COM3选择
      const that =this
      that.setData({MQTT_target:"COM3"})
      if(this.data.COM3_Chose){that.setData( { COM3_Chose:false,MQTT_target:"NULL" }) }
      else{ that.setData({COM3_Chose:true,COM1_Chose:false,
        COM2_Chose:false,COM4_Chose:false,MQTT_target:"COM3"})}
      console.log(this.data.MQTT_target);
      console.log(this.data.COM3_Chose);
      that.setData({
        COM_Chose:3
      })
    },
  onCOM4Change(event){//COM4选择
      const that =this
      if(this.data.COM4_Chose){that.setData( { COM4_Chose:false, MQTT_target:"NULL"}) }
      else{ that.setData({COM4_Chose:true,COM1_Chose:false,
        COM3_Chose:false,COM2_Chose:false,MQTT_target:"COM4"})}
      console.log(this.data.MQTT_target);
      console.log(this.data.COM4_Chose);
      that.setData({
        COM_Chose:4
      })
  },
  /*COM选择结束*/

    /*时长选择结束*/
  onTime1Change(event){//1元/3小时选择
    const that =this
    if(this.data.Timer1_Chose){that.setData( { Timer1_Chose:false, Timer:0}) }
    else{ that.setData({Timer1_Chose:true,Timer2_Chose:false, Timerx_Chose:false,Timer:1})}
    console.log(this.data.Timer);
    console.log(this.data.Timer1_Chose);
    that.setData({
      Timer_Chose:1
    })
},

  onTime2Change(event){//2元/6小时选择
  const that =this
  if(this.data.Timer2_Chose){that.setData( { Timer2_Chose:false,Timer:0 }) }//ture
  else{ that.setData({Timer2_Chose:true,Timerx_Chose:false, Timer1_Chose:false,Timer:2 })}//false
  console.log(this.data.Timer);
  console.log(this.data.Timer2_Chose);
  that.setData({
    Timer_Chose:2
  })
},
  onTimexChange(event){//自定义小时选择
  const that =this
  if(this.data.Timerx_Chose){that.setData( { Timerx_Chose:false,Timer:0 }) }
  else{ that.setData({Timerx_Chose:true,Timer2_Chose:false, Timer1_Chose:false,Timer:'x'})}
  console.log(this.data.Timer);
  console.log(this.data.Timerx_Chose);
  that.setData({
    Timer_Chose:'x'
  })
},
 /*时长选择结束*/
/*充电指令下发任务开始*/ 
OnStart(event){
  const that = this;
  if(app.globalData.show == true){//判断是否登录
  if (that.data.MQTT_target!="NULL" && that.data.Timer != 0) {//端口不为空，且时长不为0...
    wx.showModal({
    title: '提示',
    content: '确定开始充电吗？',
    success(res) {//确定充电
      if(app.globalData.Usermone>=that.data.Timer){//余额充足
      that.data.client.publish(mpPuTopic,JSON.stringify
        ({//MQTT发送消息
        target:that.data.MQTT_target,
        value:that.data.Timer,
      }),
      function (err) {
          if (!err) {
          console.log('成功下达指令充电'); 
          app.globalData.Onstaic = true;//充电状态置1
          app.redmone(app.globalData.UserPhone,that.data.Timer,that.data.MQTT_target);//数据库修改金额
          /*订单数据更新区--开始*/
          app.globalData.countdownSeconds=that.data.Timer*3*60*60;//计时时间 /秒
          app.globalData.startTime=`${app.globalData.year}-${app.globalData.month}-${app.globalData.day}-${app.globalData.hours}-${app.globalData.minutes}-${app.globalData.seconds}`;//开始时间
          app.globalData.endTime= 'NULL';//结束时间
          app.globalData. paymentAmount=that.data.Timer_Chose;//支付金额元
          app.globalData. estimatedChargeDuration= that.data.Timer_Chose*3*60;//预计时长/分钟
          if(that.data.COM_Chose=1){
              app.globalData.siteName= '充电站A';//站点名称
              app.globalData.siteNumber= 'A001';//设备编号
              app.globalData.portNumber= 'COM1';//端口号
          }
          if(that.data.COM_Chose=2){
              app.globalData.siteName= '充电站A';//站点名称
              app.globalData.siteNumber= 'A001';//设备编号
              app.globalData.portNumber= 'COM2';//端口号
          }
          if(that.data.COM1_Chose=3){
              app.globalData.siteName= '充电站B';//站点名称
              app.globalData.siteNumber= 'A002';//设备编号
              app.globalData.portNumber= 'COM3';//端口号
          }
          if(that.data.COM1_Chose=4){
              app.globalData.siteName= '充电站B';//站点名称
              app.globalData.siteNumber= 'A002';//设备编号
              app.globalData.portNumber= 'COM3';//端口号
          }

          
          
          /*订单数据更新区--结束*/

          wx.navigateTo({
            url: '/pages/countdowm/countdowm',
          })
        }
        else{
            console.log('启动失败。MQTT链接出问题')
            wx.showModal({
              title: '错误',
              content: '网络连接失败'
            })
        }
      })
  } 
    else{
      wx.showModal({
        title: '提示',
        content: '余额不足，请充值',
      })
    }
  }
})
  }
else{
  wx.showToast({
    //反馈
    title: '请选端口及时长'
    })
}
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
  // MQTT数据上传接收处理
 onShow(){
   const that=this;
   that.setData({
      //wxs 实际上就是wss =》 wss 实际上就是拥有SSL加密的websockect协议
      client: connect(`wxs://${mqttHost}:${mqttPort}/mqtt`)
    })
    that.data.client.on('connect',function(params) {
      console.log('成功连接到MQTT服务器');
      wx.showToast({
        title: '连接成功',
        icon:'success',
        mask:true
      })
        that.data.client.subscribe(mpSuTopic,function (err) {
          if (!err)
          { console.log('成功订阅设备上行数据Topic')}
        })
      } )
      that.data.client.on('message',function(topic,message) {
        console.log(topic);
        console.log(message);
        //message 是十六进制的buffer字节流
        let dataFromDev={}
        try{
          dataFromDev= JSON.parse(message)
        console.log(dataFromDev);
      //  console.log(dataFromDev.value);
        that.setData({
            /*MQTT接收到的数据 写入存储*/
            COM1_State:dataFromDev.COM1,
            COM2_State:dataFromDev.COM2,
            COM3_State:dataFromDev.COM3,
            COM4_State:dataFromDev.COM4,
        })
        }
        catch(error){
          console.log('JONS错误',error);
        }
      
      })
 },
/*数据变化页面跳转*/
    open: function (e) {
      wx.navigateTo({
       //url: '/pages/line/index'//折线图

  url: '/pages/countdowm/countdowm'
      });
    },

    /*获取实时时间 */
    onLoad: function () {
      this.getCurrentTime();
    },
    getCurrentTime: function () {//获取并更新时间函数
      setInterval(() => {//定时器计时，每秒更新时间一次
        const now = new Date();//获取数据
        const year = now.getFullYear();//年
        const month = this.formatNumber(now.getMonth() + 1);//月
        const day = this.formatNumber(now.getDate());//日
        const hours = this.formatNumber(now.getHours());//时、24小时制
        const minutes = this.formatNumber(now.getMinutes());//分
        const seconds = this.formatNumber(now.getSeconds());//秒
        const currentTime = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;//整合时间数据
        /*存储当前获取的数据到全局*/
        app.globalData.year=year;
        app.globalData.month=month;
        app.globalData.day=day;
        app.globalData.hours=hours;
        app.globalData.minutes=minutes;
        app.globalData.seconds=seconds;
        /*存储当前获取的数据到全局代码段结束*/

        this.setData({ currentTime });
      }, 1000);
    },
    formatNumber: function (num) {
      return num < 10 ? '0' + num : num;
    },
      /*获取实时时间代码段结束 */
},
)

const app = getApp()
// const {connect}  =require('../../utils/mqtt')
const mqttHost='www.litaihua.site'//mqtt服务器域名
const mqttPort=8084//mqtt端口号
const deviceSubTopic='/LTH/sub'//设备订阅Topic（小程序发布命令的Topic）
const devicePubTopic='/LTH/pub'//设备发布Topic（小程序订阅数据的Topic）
const mpSuTopic = devicePubTopic;//发
const mpPuTopic = deviceSubTopic;//收


Page({
  data:{
    total:50,
    mode:2,
    price:0,
    mode_show:'',
  }


})
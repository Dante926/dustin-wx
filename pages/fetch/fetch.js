const app = getApp()
import {
  axios
} from "../../utils/axios"
// // const {connect}  =require('../../utils/mqtt')
// const mqttHost='www.litaihua.site'//mqtt服务器域名
// const mqttPort=8084//mqtt端口号
// const deviceSubTopic='/LTH/sub'//设备订阅Topic（小程序发布命令的Topic）
// const devicePubTopic='/LTH/pub'//设备发布Topic（小程序订阅数据的Topic）
// const mpSuTopic = devicePubTopic;//发
// const mpPuTopic = deviceSubTopic;//收

Page({
  data: {
    total: 50,
    mode: '',
    price: '',
    mode_show: '',
    pickup_id: 1
  },
  // 取纸管理方法
  pickup() {
    if (app.globalData.show === false) { // 如果是未登录状态，点击取纸后显示登录弹窗
      wx.showModal({
        title: '用户未登录',
        content: '跳转至登录页面',
        complete: (res) => {
          if (res.cancel) {
            return;
          }
          if (res.confirm) {
            wx.navigateTo({
              url: '../logs/logs',
            })
          }
        }
      })
    } else if (app.globalData.show === true) { // 登录状态下正常取纸逻辑
      wx.showModal({
        title: '确认操作',
        content: '是否确认取纸',
        complete: (res) => {
          if (res.cancel) {// 取消取纸
            return;
          }
          if (res.confirm) {// 确认取纸
            const params={
              phone:app.globalData.UserPhone,
              pickup_id:this.data.pickup_id,
              price:this.data.price
            }
            axios('/pkup/confirm_pkup','POST',params)
            .then(res=>{// 请求成功
              console.log(res);
              wx.showToast({
                title: '取纸成功，请留意出纸状态~',
                icon:'none',
                success:()=>{
                  console.log('取纸成功');
                  this.onShow()
                }
              })
            })
            .catch(err=>{// 请求异常
              console.log(err);
              wx.showToast({
                title: '系统错误，请重试',
                icon:'none'
              })
            })
          }
        }
      })
    } else { // 程序错误警告
      wx.showToast({
        title: '操作出错',
        icon: 'none'
      })
    }
  },

  onShow: function () {
    console.log(app.globalData);
    const params = {
      pickup_id: this.data.pickup_id
    }
    axios('/equipment/pulleqstatus', 'POST', params)
      .then(res => {
        const {
          data
        } = res.data
        this.setData({
          mode: data[0].ispay_flag,
          total: data[0].total,
          price: data[0].ispay_flag === 0 ? 0 : data[0].set_mone
        })
        return;
      })
      .catch(err => { // 获取设备状态请求出错
        wx.showToast({
          title: '系统错误请重试',
          icon: 'none'
        })
        return;
      })
  },

})
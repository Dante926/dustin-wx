const app = getApp();
// const LogsData =require('../../pages/logs/logs.js')
import {
  axios
} from '../../utils/axios'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    localhost: app.globalData.localhost,
    activeIndex: 0, //默认选中第一个
    numArray: [5, 10, 20, 30, 50, 'm'], //充值金额的挡位选择
    date: [],
    Mone: 0,
    Chose: 5, //选择充值得金额，默认20
    IputVal: 0, //自定义的金额
    UserPhone: app.globalData.UserPhone
  },

  activethis: function (event) { //点击选中事件
    var thisindex = event.currentTarget.dataset.thisindex; //当前index
    this.setData({
      activeIndex: thisindex
    })
    /*假如选择固定金额*/
    if (thisindex < 5) {
      this.setData({
        Chose: this.data.numArray[thisindex],
        IputVal: 0 //将自定义金额置零
      })
    }
    /*假如选择自定义金额*/
    else {
      this.setData({
        Chose: 0 //选择的固定金额置零
      })
    }
  },

  //立即充值监听：
  Recharge: function (event) {
    if (app.globalData.show) {
      wx.showModal({ //再次确认是否充值
        title: '提示',
        content: '确定充值吗？',
        success: (res) => {
          if (res.confirm) { //假如确定
            wx.showToast({ //充值反馈
                title: '充值成功',
              }),
              app.globalData.Mone = Number(this.data.Chose) + Number(this.data.Mone) + Number(this.data.IputVal) //余额计
            this.setData({
              Mone: app.globalData.Mone
            })

            // 余额充值接口 - Dante
            const params = {
              phone: app.globalData.UserPhone,
              mone: this.data.Mone
            }
            axios('/balance/rechange', 'POST', params)
              .then(res => {
                console.log(res);
                app.globalData.Mone = this.data.Mone
                return;
              })
              .catch(err => {
                wx.showToast({
                  title: '操作失败，请重试',
                  icon: 'none'
                })
                return
              })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    }
  },

  /*获取输入的金额并将文本转化为数字*/
  getValue(e) {
    console.log(e.detail);
    var a1 = e.detail.value;
    var a2 = RegExp('^\-', 'g').exec(e.detail.value)
    var g = 1;
    if (a2) {
      g = -1;
    }
    var a3 = parseFloat(a1.replace(/\D/g, '')) * g
    this.setData({
      IputVal: a3
    })
    //
  },

  onShow() {
    console.log(app.globalData);
    if (app.globalData.show == true) { //用户已经登录
      this.setData({
        Mone: app.globalData.Mone,
        UserPhone: app.globalData.UserPhone
      })
    } else { //假如没有登录
      this.setData({
        Mone: 0
      })
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/logs/logs',
            })
          }
        }
      })
    }
  },

})
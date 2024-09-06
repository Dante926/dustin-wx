const app = getApp();
// const LogsData =require('../../pages/logs/logs.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    login: {
      show: app.globalData.show,
      avatarUrl: '', //头像地址
    },
    UserPhone: app.globalData.UserPhone,
    localhost: app.globalData.localhost,
    num: 20 //计数值
  },

  // 获取code、userInfo等信息
  getUserProfile() {
    var p1 = new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          // 这里也可以选择性返回需要的字段
          resolve(res)
        }
      })
    })
    var p2 = new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: res => {
          // 这里也可以选择性返回需要的字段
          resolve(res)
        }
      })
    })
    // 同时执行p1和p2，并在它们都完成后执行then
    Promise.all([p1, p2]).then((results) => {
      // results是一个长度为2的数组，放置着p1、p2的resolve
      this.handleUserInfo({
        // 这里也可以选择性返回需要的字段
        ...results[0],
        ...results[1]
      })
    })
  },

  // 组织好后端需要的字段，并调用接口
  handleUserInfo(data) {
    const {
      code,
      encryptedData,
      userInfo,
      iv,
      rawData,
      signature,
      cloudID
    } = data
    const params = {
      userInfo,
      // ....
    }
    // 调用接口维护本地登录态
  },

  // 获取头像监听 - Dante
  chooseAvatar(e) {
    console.log(typeof (this.data.login.show));
    if (this.data.login.show === false) {
      console.log('1');
      wx.navigateTo({
        url: '/pages/logs/logs'
      });
    } else {
      app.globalData.avatarUrl = e.detail.avatarUrl
      this.setData({
        avatarUrl: e.detail.avatarUrl
      })
    }
  },

  // 基本信息
  basicClick() {
    console.log('基本信息监听');

    if (app.globalData.show == true) {
      wx.navigateTo({
        url: '/pages/personal_informati/personal_informati',
      })
    } else {
      wx.showModal({
        title: '请先登录',
        complete: (res) => {
          if (res.confirm) {}
        }
      })
    }
  },

  // 订单管理监听
  aboutClick() {
    console.log('订单管理监听');
    if (app.globalData.show == true) { // 如果用户已登录
      app.globalData.order = null,
        app.get_order();
      wx.navigateTo({
        url: '/pages/order_information/order_information',
      })
    } else { // 用户未登录
      wx.showModal({
        title: '请先登录',
        complete: (res) => {
          if (res.confirm) {

          }
        }
      })
    }

  },

  // 退出登录
  exitClick(e) {
    let that = this;
    if (this.data.login.show == true) {
      wx.showModal({
        title: '提示',
        content: '确定退出登录吗？',
        success(res) {
          if (res.confirm) {
            app.globalData.show = false,
              app.globalData.UserPhone = 0,
              app.globalData.Usermone = 0,
              that.setData({
                login: {
                  show: false,
                }
              })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/logs/logs'
      });
      /* this.setData({
        login: {
          //show: true,
          avatar: "/static/dabao.png",
        }
      }) */
    }
  },
  Returnindx: function (e) {
    wx.navigateTo({
      url: '/pages/index/index',
    });
  },
  //  Returnindx(){
  //     wx.switchTab({
  //       url: '/pages/index/index'
  // });
  //   },
  getData() {
    this.setData({
      login: {
        show: app.globalData.show,
      },
      UserPhone: app.globalData.UserPhone
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
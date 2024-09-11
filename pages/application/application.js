const app = getApp();
import {
  axios
} from '../../utils/axios'
Page({
  data: {
    showModal: false,
    phone: '',
    deviceOptions: ['01', '02'], // 设备选项示例
    deviceIndex: 0,
    nickname: '',
    amount: 100, // 这里支付金额设置为固定的100
    power: '',
    // 管理员管理租赁-------------------------
    applications: [] // 初始化为空数组
    // End ----------------------------------
  },

  // 申请租赁JS----------------------------
  // 显示弹窗
  showModal() {
    this.setData({
      showModal: true
    });
  },

  // 蒙版 关闭弹窗
  hideModal() {
    this.setData({
      showModal: false
    });
  },

  // 获取输入的手机号
  inputPhoneNumber(e) {
    this.setData({
      phoneNumber: e.detail.value
    });
  },

  // 获取申请租赁的设备号
  onDeviceChange(e) {
    this.setData({
      deviceIndex: e.detail.value
    });
  },

  //获取设置的管理员昵称
  inputNickname(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  // 提交租赁信息
  submitForm() {
    const {
      phone,
      deviceOptions,
      deviceIndex,
      nickname
    } = this.data;
    const deviceNumber = deviceOptions[deviceIndex];
    if (phone && deviceNumber && nickname) {
      if (app.globalData.Mone < 100) { // 如果用户余额不足100元
        wx.showToast({
          title: '租赁机器需先支付100元，您的余额不足请先充值',
          icon: 'none'
        })
        return;
      } else {
        wx.showModal({
          title: '确认申请',
          content: '是否确认申请租赁机器0' + (Number(this.data.deviceIndex) + 1),
          complete: (res) => {
            if (res.cancel) { // 取消申请租赁
              return;
            }
            if (res.confirm) { // 确认租赁
              const params = {
                phone: this.data.phone,
                name: this.data.nickname,
                manage_eq_id: Number(deviceIndex) + 1,
                pay_mone: this.data.amount
              }
              axios('/admin/application', 'POST', params)
                .then(res => {
                  wx.showModal({
                    title: '申请情况',
                    content: res.data.message,
                    complete: (res) => {
                      if (res.cancel) {
                        return;
                      }
                      if (res.confirm) {
                        return;
                      }
                    }
                  })
                })
            }
          }
        })
      }
    } else { // 有必填项未填
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
  },

  // 申请租赁Ene----------------------------

  // 管理员同意管理租赁-------------------------
  onAgree(e) {
    const phone = e.currentTarget.dataset.phone;
    const item = this.data.applications.find(app => app.phone === phone);
    const params = {
      phone: item.phone,
      name: item.name,
      manage_eq_id: item.pickup_id
    }
    axios('/admin/agree', 'POST', params)
      .then(res => {
        console.log(res);
        if (res.data.message === '申请成功') {
          wx.showModal({
            title: '提示',
            content: '已同意' + item.name + '成为管理员',
            complete: (res) => {
              if (res.cancel) {
                this.pullapplication();
                return;
              }
              if (res.confirm) {
                this.pullapplication();
                return;
              }
            }
          })
        } else if (res.data.message === '余额不足') {
          wx.showModal({
            title: '提示',
            content: '用户余额不足,请联系用户充值',
            complete: (res) => {
              if (res.cancel) {
                return;
              }
              if (res.confirm) {
                return;
              }
            }
          })
        } else {
          wx.showToast({
            title: '操作失败,' + res.data.message,
            icon: 'none'
          })
          return;
        }
      })
  },

  // 获取申请租赁纪录方法
  pullapplication() {
    axios('/admin/pullapplication', 'POST')
      .then(res => {
        const {
          code,
          data
        } = res.data
        if (code === 200) {
          this.setData({
            applications: data[0].map(item => {
              const date = new Date(item.date);
              const formattedTime = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
              return {
                ...item,
                date: formattedTime,
              };
            })
          })
          console.log(this.data.applications);
        }
      })
  },

  onReject() {
    wx.showToast({
      title: '拒绝租赁,保留数据用户',
      icon: 'none'
    })
    return;
  },
  // End ----------------------------------

  onShow() {
    this.setData({
      power: app.globalData.power,
      phone: app.globalData.UserPhone
    })
    /* 超级管理员Sta */
    this.pullapplication();
    /* 超级管理员End */
    if (this.data.power === 1) {
      wx.showModal({
        title: '提示',
        content: '你已是管理员，不可申请管理多个机器',
        complete: (res) => {
          if (res.cancel) {
            wx.navigateBack({
              delta: 1 // 回退的页面数，默认是1
            });
            return;
          }
          if (res.confirm) {
            wx.navigateBack({
              delta: 1 // 回退的页面数，默认是1
            });
            return;
          }
        }
      })
    }
  }
});
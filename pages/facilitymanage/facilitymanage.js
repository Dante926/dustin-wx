// 获取应用实例
const app = getApp()
import {
  axios
} from '../../utils/axios'


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
  },

  // Dante ----------------------------------

  // 更改机器状态
  handleSave() {
    wx.showModal({
      title: '更改机器状态',
      content: '是否更改机器0' + this.data.pickup_id + '状态',
      complete: (res) => {
        if (res.cancel) { // 取消更改
          wx.showToast({
            title: '取消更改',
            icon: 'none'
          })
          return;
        }
        if (res.confirm) {
          const params = {
            pickup_id: this.data.pickup_id,
            ispay_flag: this.data.paperMachineEnabled === false ? 2 : (this.data.chargeModeEnabled === false ? 0 : 1),
            set_mone: this.data.mone,
            paper_fre: this.data.frequency,
          }
          axios('/equipment/changestatus', 'POST', params)
            .then(res => {
              console.log(res);
              const {
                message
              } = res.data
              if (message === 'Success') {
                wx.showToast({
                  title: '设备状态修改成功',
                  icon: 'none'
                })
                this.pulleqstatus(this.data.pickup_id);
                return;
              } else {
                wx.showToast({
                  title: '修改设备状态失败，请重试',
                  icon: 'none'
                })
                return;
              }
            })
        }
      }
    })
  },

  // 机器容量补给
  handleSupply() {
    wx.showModal({
      title: '取纸机01容量补给',
      content: '设备01剩余容量' + this.data.total + ',是否补给',
      complete: (res) => {
        if (res.cancel) { // 取消补给提示
          wx.showToast({
            title: '取消补给',
            icon: 'none'
          })
          return;
        }
        if (res.confirm) { // 确认补给
          const params = {
            pickup_id: this.data.pickup_id,
            total: this.data.total
          }
          axios('/equipment/supply', 'POST', params)
            .then(res => {
              const {
                message
              } = res.data
              wx.showToast({
                title: '补给成功,' + message,
                icon: 'none'
              })
              this.pulleqstatus(this.data.pickup_id)
              return;
            })
            .catch(err => { // 系统错误
              wx.showToast({
                title: '系统出错，请重试',
                icon: 'none'
              })
              return;
            })
        }
      }
    })
  },

  // 获取当前设备状态
  pulleqstatus(pickup_id) {
    const params = {
      pickup_id,
    }
    axios('/equipment/pulleqstatus', 'POST', params)
      .then(res => {
        const {
          data
        } = res.data
        if (data[0].pickup_id === pickup_id) {
          this.setData({
            pickup_id,
            paperMachineEnabled: data[0].ispay_flag === 2 ? false : true,
            chargeModeEnabled: data[0].ispay_flag === 1 ? true : false,
            mone: data[0].set_mone,
            frequency: data[0].paper_fre,
            total: data[0].total
          })
          if (this.data.chargeModeEnabled === false) {
            this.setData({
              mone: 0
            })
          }
        }
      })
      .catch(err => { // 请求错误
        wx.showToast({
          title: '获取数据失败',
          icon: 'none',
        })
        return;
      })
  },

  // 切换当前取纸设备
  handleEqChange: function (e) {
    if (this.data.power != 2) {
      wx.showToast({
        title: '你只可管理设备0' + app.globalData.manage_eq_id + '!',
        icon: 'none'
      })
      this.setData({
        pickup_id: app.globalData.manage_eq_id
      })
      return;
    }
    this.setData({
      pickup_id: this.data.pikupoptions[e.detail.value]
    });
    this.pulleqstatus(this.data.pickup_id)
  },

  // 启用取纸机
  handlePaperMachineChange: function (e) {
    this.setData({
      paperMachineEnabled: e.detail.value
    });
  },

  //改变收费模式
  handleChargeModeChange: function (e) {
    if (this.data.paperMachineEnabled === true) { // 判断是否启用了机器
      this.setData({
        chargeModeEnabled: e.detail.value
      })
      if (this.data.chargeModeEnabled === false) {
        this.setData({
          mone: 0
        })
      }
      return;
    } else { // 如果未启用机器则先提醒启用机器
      wx.showModal({
        title: '请先开启设备',
        content: '请确认开启设备',
        complete: (res) => {
          if (res.cancel) {
            this.setData({
              paperMachineEnabled: false,
              chargeModeEnabled: false
            })
            return;
          }
          if (res.confirm) {
            this.setData({
              paperMachineEnabled: true
            })
          }
        }
      })
    }
  },

  // 选择金额改变
  handleMoneChange: function (e) {
    if (this.data.chargeModeEnabled === false) { // 如果当前机器不是收费状态
      wx.showModal({ // 提示是否开启收费状态
        title: '请先开启收费模式',
        content: '确认开启收费模式',
        complete: (res) => {
          if (res.cancel) { // 不开启
            this.setData({
              mone: 0
            })
            return;
          }
          if (res.confirm) { // 开启
            this.setData({
              paperMachineEnabled: true,
              chargeModeEnabled: true,
              mone: this.data.moneOptions[e.detail.value]
            })
          }
        }
      })
    } else {
      this.setData({
        mone: this.data.moneOptions[e.detail.value]
      });
    }
  },

  // 出纸频率改变
  handleFrequencyChange: function (e) {
    this.setData({
      frequency: this.data.frequencyOptions[e.detail.value]
    });
  },

  //  End -----------------------------------


  onShow: async function () {
    // Dante-----------------------------
    // 设置用户权限
    this.setData({
      power: app.globalData.power,
      manage_eq_id: app.globalData.manage_eq_id
    })
    console.log(app.globalData.manage_eq_id);
    if (app.globalData.power != 2) { // 如果不是超级管理员，只能管理对应的机器
      this.setData({
        pickup_id: app.globalData.manage_eq_id
      })
      this.pulleqstatus(this.data.pickup_id) // 获取当前对应id设备状态
    } else {
      this.pulleqstatus(this.data.pickup_id) // 获取当前对应id设备状态
    }
    //  End -----------------------------
  },
}, )
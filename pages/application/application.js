const app = getApp();
import {axios} from '../../utils/axios'
Page({
  data: {
    showModal: false,
    phone: '',
    deviceOptions: ['01', '02'], // 设备选项示例
    deviceIndex: 0,
    nickname: '',
    amount: 100, // 这里支付金额设置为固定的100
    power: ''
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
      if(app.globalData.Mone < 100){ // 如果用户余额不足100元
        wx.showToast({
          title: '租赁机器需先支付100元，您的余额不足请先充值',
          icon:'none'
        })
        return;
      }else{
      // 这里可以添加表单提交的逻辑，例如调用 API 或存储数据
      const params = {
        phone:this.data.phone,
        name:this.data.nickname,
        manage_eq_id:Number(deviceIndex)+1,
        pay_mone:this.data.amount
      }
      axios('/admin/application','POST',params)
      .then(res=>{
        wx.showModal({
          title: '申请情况',
          content: res.data.message,
          complete: (res) => {
            if (res.cancel) {
              return
            }
            if (res.confirm) {
              return
            }
          }
        })
      })
      /* wx.showToast({
        title: '申请提交成功',
        icon: 'success'
      });
      this.hideModal(); */
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

  onShow() {
    console.log(app.globalData);
    this.setData({
      power: app.globalData.power,
      phone:app.globalData.UserPhone
    })
  }
});
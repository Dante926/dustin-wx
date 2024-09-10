Page({
  data: {
    showModal: false,
    phoneNumber: '',
    deviceOptions: ['01', '02'], // 设备选项示例
    deviceIndex: 0,
    nickname: '',
    amount: 100 // 这里支付金额设置为固定的100
  },

  showModal() {
    this.setData({
      showModal: true
    });
  },

  hideModal() {
    this.setData({
      showModal: false
    });
  },

  inputPhoneNumber(e) {
    this.setData({
      phoneNumber: e.detail.value
    });
  },

  onDeviceChange(e) {
    this.setData({
      deviceIndex: e.detail.value
    });
  },

  inputNickname(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  submitForm() {
    const { phoneNumber, deviceOptions, deviceIndex, nickname } = this.data;
    const deviceNumber = deviceOptions[deviceIndex];
    if (phoneNumber && deviceNumber && nickname) {
      // 这里可以添加表单提交的逻辑，例如调用 API 或存储数据
      wx.showToast({
        title: '申请提交成功',
        icon: 'success'
      });
      this.hideModal();
    } else {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
    }
  }
});

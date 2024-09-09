// orders.js  订单管理
const app = getApp();
import {
  axios
} from '../../utils/axios.js'
Page({
  data: {
    localhost: app.globalData.localhost, //本地地址
    orders: [], //订单信息数组
    flag: false,
    times: 3,
  },

  onShow: function () {
    console.log(app.globalData);
    const params = {
      power:app.globalData.power,
      phone: app.globalData.UserPhone,
    };
    axios('/pkup/pullorder', 'POST', params)
      .then(res => {
        console.log(res.data);
        if (res.data && res.data.length > 0) {
          // 格式化时间数据--------------------------------
          const formattedOrders = res.data.map(order => {
            const date = new Date(order.date);
            const formattedTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            return {
              ...order,
              date: formattedTime,
            };
          });
          // END-------------------------------------------
          this.setData({
            orders: formattedOrders,
            flag: true,
          });
        } else {
          this.setData({
            orders: [],
            flag: false,
          });
        }
      })
      .catch(error => {
        console.error('请求失败', error);
        this.setData({
          orders: [],
          flag: false,
        });
      });
  }

})
export const axios = (url, method, data) => {
  const base_url = 'http://127.0.0.1:8088'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base_url}${url}`,
      method: method ? method : 'GET',
      data,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
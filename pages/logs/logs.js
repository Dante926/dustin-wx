const app = getApp();

// 引入防抖函数
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
// 引入自定义请求函数
import {
  axios
} from '../../utils/axios'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    localhost: app.globalData.localhost,
    current: 1, //1为登录页面、、0为注册页面
    codeText: '获取验证码',
    counting: false,
    satic: 0,
    UserPhone: 0, //用户输入的账号(电话)
    UserPasswd: 0, //用户输入的密码
    userPhone: 0, //注册手机号
    userPasswd1: 0, //注册密码
    userPasswd2: 1, //注册重复输入密码
    Getpassw: 1, //数据库返回来的密码
    GetPhone: 123456, //数据库返回来账号（电话）
    Show: false, //登录状态
    UserPhoneCursor: 0,
    code: "", //随机生成验证码
    mcode: '' //用户输入的验证码
  },
  // 账号登录监听
  // 账号登录监听
  getUser: debounce(function (e) {
    console.log("登录账号监听");
    console.log(e.detail);

    // 获取输入的数据
    var inputValue = e.detail.value.trim(); // 去掉首尾空格

    // 处理负号和数字提取
    var sign = 1;
    if (inputValue.startsWith('-')) {
      sign = -1;
      inputValue = inputValue.substring(1); // 去掉负号
    }

    // 提取纯数字部分
    var numericValue = parseFloat(inputValue.replace(/[^0-9]/g, '')); // 替换非数字字符
    numericValue = isNaN(numericValue) ? 0 : numericValue; // 如果转换结果是NaN，则设为0
    var finalValue = numericValue * sign;

    // 将处理后的结果存储到数据中
    this.setData({
      UserPhone: finalValue // 将处理后的电话号码存储
    });
  }, 500),

  // 登录密码监听
  // 处理登录密码输入
  getPower: function (e) {
    console.log("登录密码监听");
    console.log(e.detail);

    // 获取输入的数据
    var inputValue = e.detail.value.trim(); // 去掉首尾空格

    // 处理负号和数字提取
    var sign = 1;
    if (inputValue.startsWith('-')) {
      sign = -1;
      inputValue = inputValue.substring(1); // 去掉负号
    }

    // 提取纯数字部分
    var numericValue = parseFloat(inputValue.replace(/\D/g, '')); // 替换非数字字符
    numericValue = isNaN(numericValue) ? 0 : numericValue; // 如果转换结果是NaN，则设为0
    var finalValue = numericValue * sign;

    // 将处理后的结果存储到数据中
    this.setData({
      UserPasswd: finalValue // 将处理后的密码存储
    });
  },

  // 登陆注册监听
  click: function (e) {
    let index = e.currentTarget.dataset.code;
    this.setData({
      current: index,
    });
  },

  //  注册账号、密码监听
  get_register_Phone: function (e) {
    console.log("登录账号监听");
    console.log(e.detail);
    /*将输入的数据转化成数字*/
    var a1 = e.detail.value;
    var a2 = RegExp('^\-', 'g').exec(e.detail.value)
    var g = 1;
    if (a2) {
      g = -1;
    }
    var a3 = parseFloat(a1.replace(/\D/g, '')) * g
    this.setData({
      userPhone: a3, //将获取的电话账号存储
      UserPhoneCursor: e.detail.cursor
    })
  },

  //注册密码输入监听
  get_register_Passwd1: function (e) {
    console.log("密码输入监听");
    console.log(e.detail);
    /*获取输入的数据转化为纯数字*/
    var a1 = e.detail.value;
    var a2 = RegExp('^\-', 'g').exec(e.detail.value)
    var g = 1;
    if (a2) {
      g = -1;
    }
    var a3 = parseFloat(a1.replace(/\D/g, '')) * g
    this.setData({
      userPasswd1: a3,
    })
  },

  //注册密码确认监听
  get_register_Passwd2: function (e) {
    console.log("密码确认监听");
    console.log(e.detail);
    /*获取输入的数据转化为纯数字*/
    var a1 = e.detail.value;
    var a2 = RegExp('^\-', 'g').exec(e.detail.value)
    var g = 1;
    if (a2) {
      g = -1;
    }
    var a3 = parseFloat(a1.replace(/\D/g, '')) * g
    this.setData({
      userPasswd2: a3,
    })
  },

  //获取验证码 
  generateCode() {
    var code = "";
    var charset = "0123456789";
    for (var i = 0; i < 6; i++) {
      var randomIndex = Math.floor(Math.random() * charset.length);
      code += charset.charAt(randomIndex);
    }
    return code;
  },

  getCode() {
    var that = this;
    if (!that.data.counting) {
      wx.showToast({
        title: '验证码已发送',
      })
      //开始倒计时60秒
      that.countDown(that, 60);
    }
    var code = this.generateCode();
    that.setData({
      code: code
    });
    console.log(that.data.code)

    //将验证发出去
    /* wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send',
      method: 'POST',
      data: {
        access_token: 'YOUR_ACCESS_TOKEN',//用于调用微信接口的访问令牌，你需要根据实际情况获取。
        touser: 'OPENID_OF_THE_USER',//要发送验证码的用户的 OpenID。
        template_id: 'YOUR_TEMPLATE_ID',//在小程序后台配置的模板消息 ID。
        page: 'PAGES/INDEX', // 模板消息点击后跳转的页面路径，根据实际情况修改。
        data: {
          keyword1: { value: '验证码' },
          keyword2: { value: '123456' } // 替换为实际的验证码
        }
      },
      success: function(res) {
        console.log(res);
        // 发送成功后进行相应的操作
      },
      fail: function(err) {
        console.error(err);
        // 发送失败时进行相应的处理
      }
    });
*/

  },

  get_register_Code: function (e) {
    console.log("验证码监听");
    console.log(e.detail);
    /*获取输入的数据转化为纯数字*/
    var a1 = e.detail.value;
    var a2 = RegExp('^\-', 'g').exec(e.detail.value)
    var g = 1;
    if (a2) {
      g = -1;
    }
    var a3 = parseFloat(a1.replace(/\D/g, '')) * g
    this.setData({
      mcode: a3,
    })
  },
  //倒计时60秒
  countDown(that, count) {
    if (count == 0) {
      that.setData({
        codeText: '获取验证码',
        counting: false
      })
      return;
    }
    that.setData({
      counting: true,
      codeText: count + '秒后重新获取',
    })
    setTimeout(function () {
      count--;
      that.countDown(that, count);
    }, 1000);
  },

  /*登录/注册按钮监听*/
  Logs: function (e) {
    var inputCode = this.data.mcode; // 获取输入的验证码
    var generatedCode = this.data.code;
    if (this.data.current == 1) { //登录功能
      if (this.data.UserPhone == ' ') { //账户为空则提示
        wx.showToast({
          //反馈
          title: '请输入账号',
          icon: 'none'
        })
      } else { //查询数据库
        // 登录功能 - Dante
        // 设置请求参数
        const params = {
          Phone: this.data.UserPhone //根据手机号搜索
        }
        // 登录请求接口
        axios('/logs/login', 'POST', params)
          .then(res => {
            console.log(res.data);
            const {
              data
            } = res.data
            this.data.Getpassw = data[0].password;
            if (this.data.Getpassw == this.data.UserPasswd) {
              app.globalData.UserPhone = this.data.UserPhone; //更新账户
              app.globalData.show = true; //修改登陆状态
              app.globalData.Flag = true; //修改刷新标记
              app.globalData.Usermone = data[0].mone;
              app.globalData.Username = data[0].name;

              // 跳转至User页面
              wx.switchTab({
                url: '/pages/User/User',
                success: () => {
                  wx.showToast({
                    title: '登录成功'
                  })
                }

              });

            } else { // 登录失败反馈
              wx.showToast({
                title: '账号或密码错误'
              })
            }
          })
      }
    } else { //注册功能

      if (this.data.UserPhoneCursor != 11 || inputCode != generatedCode) { //账户为空则提示,验证码正确，执行登录逻辑
        wx.showModal({
          title: '错误',
          content: '请检查账户和验证码',
        })
      } else if (this.data.UserPhoneCursor == 11 && this.data.userPasswd1 == this.data.userPasswd2 && inputCode == generatedCode) { //查询数据库
        wx.request({
          method: 'POST',
          url: this.data.localhost + '/InUser',
          data: {
            Phone: this.data.userPhone, //注册账号
            Passwd: this.data.userPasswd1 //注册密码
          },
          /*读取数据库信息*/
          success: (res) => {
            console.log(res);
            if (res.data == "error") {
              wx.showToast({
                //反馈
                title: '账户已被注册'
              })
            }
            if (res.data.message == "InUser_success") {
              wx.showModal({
                title: '提示',
                content: '注册成功，快去登录吧！',
              })
              this.setData({
                current: 1,
                userPhone: 0,
                userPasswd1: 0,
                userPasswd2: 0
              })
            }
          },
          fail: function () { //没有获取到值，说明这中间出问题了。
            console.log("获取失败");
          }
        });

      } else {
        wx.showToast({
          //反馈
          title: '密码不一致'
        })
      }
      console.log("还是有效果的");
    }
  },

  forgetPower: function () {

  },

  onShow: function () {
    // 需要执行的代码 
    if (this.data.satic == 1) {
      wx.navigateTo({
        url: '/pages/User/User'
      })
    }
  },
  onUnload: function () {
    clearInterval(this.timer); // 清除计时器
  }

})
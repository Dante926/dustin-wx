const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    localhost:app.globalData.localhost,
    current:1,//1为登录页面、、0为注册页面
    codeText:'获取验证码',
    counting:false,
    satic:0,
    UserPhone:0,//用户输入的账号(电话)
    UserPasswd:0,//用户输入的密码
    userPhone:0,//注册手机号
    userPasswd1:0,//注册密码
    userPasswd2:1,//注册重复输入密码
    Getpassw:1,//数据库返回来的密码
    GetPhone:123456,//数据库返回来账号（电话）
    Show :false,//登录状态
    UserPhoneCursor:0
  },
   //账号登录监听
  getUser :function (e)
   {
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
      UserPhone:a3,//将获取的电话账号存储
    })
},
  //登录密码监听
  getPower :function (e)
  {
   console.log("登录密码监听");
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
    UserPasswd:a3,

  })
 },
  // 登陆注册监听
  click:function(e){
    let index = e.currentTarget.dataset.code;
    this.setData({
      current:index,
    });
  },
  /*
  注册账号、密码监听
  */
 get_register_Phone:function (e)
  {
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
     userPhone:a3,//将获取的电话账号存储
     UserPhoneCursor:e.detail.cursor
   })
},
 //注册密码输入监听
get_register_Passwd1 :function (e)
 {
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
   userPasswd1:a3,
 })
},
 //注册密码确认监听
 get_register_Passwd2 :function (e)
 {
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
   userPasswd2:a3,
 })
},
  //获取验证码 
  getCode(){
    var that = this;
    if (!that.data.counting) {
      wx.showToast({
        title: '验证码已发送',
      })
      //开始倒计时60秒
      that.countDown(that, 60);
    } 
  },
  //倒计时60秒
  countDown(that,count){
    if (count == 0) {
      that.setData({
        codeText: '获取验证码',
        counting:false
      })
      return;
    }
    that.setData({
      counting:true,
      codeText: count + '秒后重新获取',
    })
    setTimeout(function(){
      count--;
      that.countDown(that, count);
    }, 1000);
  },

  /*登录/注册按钮监听*/
  Logs: function (e) {
    if (this.data.current==1) {    //登录功能
    if (this.data.UserPhone==' ') {//账户为空则提示
      wx.showToast({
        //反馈
        title: '请输入账号'
        })
    }
    else{//查询数据库
    wx.request({
      method: 'POST',
      url: this.data.localhost+'/Logs',
      data: {
           Phone:this.data.UserPhone//根据手机号搜索
      },
       /*读取数据库信息*/
    success :(res) => {
      console.log(res);
      console.log(res.data[0]);//输出密码
      this.data.Getpassw = res.data[0].passwd;
      if(this.data.Getpassw==this.data.UserPasswd) {
         app.globalData.UserPhone = this.data.UserPhone;//更新账户
         app.globalData.show=true;//修改登陆状态
         app.globalData.Flag=true;//修改刷新标记
         app.globalData.Usermone=res.data[0].mone;
         app.globalData.Username=res.data[0].name;
         console.log(app.globalData.UserPhone);//打印账号
         console.log(app.globalData.Usermone);//打印金额
         console.log(app.globalData.Username);//打印用户名
      //   console.log('运行到这儿了'); 
         wx.switchTab({
          url: '/pages/User/User'
         });
        }
      
        else{
          console.log("登陆失败，提示：账号或密码错误");
          wx.showToast({//登录反馈
            title: '账号或密码错误'
            })
        }
    },
      fail: function () {//没有获取到值，说明这中间出问题了。
        console.log("获取失败");
      }
    });

 }  
 }
  else{//注册功能
    if (this.data.UserPhoneCursor != 11) {//账户为空则提示
      wx.showToast({
        //反馈
        title: '请输入11位的账号'
        })
    }

    else if(this.data.UserPhoneCursor == 11&& this.data.userPasswd1== this.data.userPasswd2){//查询数据库
      wx.request({
        method: 'POST',
        url: this.data.localhost+'/InUser',
        data: {
             Phone:this.data.userPhone,//注册账号
             Passwd:this.data.userPasswd1//注册密码
        },
         /*读取数据库信息*/
      success :(res) => {
        console.log(res);
        if(res.data == "error"){
          wx.showToast({
            //反馈
            title: '账户已被注册'
            })
        }
        if(res.data.message == "InUser_success"){
          wx.showModal({
            title: '提示',
            content: '注册成功，快去登录把！',
          })
          this.setData({
            current:1,
            userPhone:0,
            userPasswd1:0,
            userPasswd2:0
          })
        }
      },
        fail: function () {//没有获取到值，说明这中间出问题了。
          console.log("获取失败");
        }
      });
    
   }  
   else{
    wx.showToast({
      //反馈
      title: '密码不一致'
      })
   }
    console.log("还是有效果的");
  }
},

onLoad: function() {
  this.timer = setInterval(() => {
    // 需要执行的代码 
    if(this.data.satic==1)
    {
      wx.navigateTo({
        url: '/pages/User/User'
       })
  }
  }, 1000)// 每隔1秒钟调用一次函数
},
onUnload: function() {
  clearInterval(this.timer); // 清除计时器
}

})


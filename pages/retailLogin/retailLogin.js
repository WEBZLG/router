const app = getApp();
var ajax = require("../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codename: '获短信取验证码',
    // phone: '13114508618', //手机号
    // code: '123456', //验证码
    phone:'',
    code:'',
    iscode: null //用于存放验证码接口里获取到的code
  },

  //事件处理函数
  goRegister: function () {
    wx.redirectTo({
      url: '../register/register'
    })
  },
  goLogin: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  //获取验证码
  getVerificationCode() {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function () {
    var a = this.data.phone;
    var _this = this;
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var item = {
        'phone': this.data.phone
      }
      wx.showLoading();
      ajax.wxRequest('POST', 'Login/sendSMS', item,
        (res) => {
          console.log(res)
          if (res.code == 200) {
            wx.hideLoading();
            wx.showToast({
              title: res.msg,
              icon: "none"
            })
            // that.setData({
            //   iscode: res.data.data
            // });
            var num = 61;
            var timer = setInterval(function () {
              num--;
              if (num <= 0) {
                clearInterval(timer);
                _this.setData({
                  codename: '重新发送',
                  disabled: false
                })

              } else {
                _this.setData({
                  codename: num + "s"
                })
              }
            }, 1000)
          } else {
            wx.hideLoading();
            wx.showToast({
              title: res.msg,
              icon: "none"
            })
          }
        },
        (err) => {
          console.log(err)
          wx.hideLoading();
          wx.showToast({
            title: '数据加载失败' + err,
            icon: "none"
          })
        })
    }
  },
  // 登录
  login: function () {
    var that = this;
    var item = {
      'phone': that.data.phone,
      'verify_code': that.data.code
    }
    if (item.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return false;
    } else if (item.verify_code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return false;
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'Login/merchantLogin', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          app.globalData.uid = res.data.merchid;
          wx.showToast({
            title: '登录成功',
            icon: "none"
          });
          setTimeout(function () {
            wx.reLaunch({
              url: '../../retailPage/pages/tabbar/tabbar',
            })
          }, 1500);
          that.setData({

          });

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }

      },
      (err) => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败' + err,
          icon: "none"
        })
      })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
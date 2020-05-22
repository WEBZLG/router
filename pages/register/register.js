// pages/register/register.js
const app = getApp();
var ajax = require("../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codename: '获短信取验证码',
    phone: '', //手机号
    code: '', //验证码
    rawData:'',//信息
    showModal: false,//弹窗
  },
  // 去登录
  goLogin: function() {
    wx.redirectTo({
      url: '../index/index',
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
  getPhoneValue: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  open: function () {
    this.setData({
      showModal: true
    })
  },
  close: function () {
    this.setData({
      showModal: false
    })
  },
  getCodeValue: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function() {
    var _this = this;
    var that = this;
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
            that.setData({
            
            });
            var num = 61;
            var timer = setInterval(function() {
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
  // 注册
  register: function() {
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
    ajax.wxRequest('POST', 'Login/register', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
          that.goLogin();

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
  // 微信登录注册
  wechatLogin: function() {
    var that = this;
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          var item = {
            'code': res.code
          }
          wx.showLoading();
          ajax.wxRequest('POST', 'Login/code', item,
            (res) => {
              wx.hideLoading();
              console.log(res)
              if (res.code == 200) {
                wx.hideLoading();
                that.open();

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
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // 获取个人信息
  getUserInfo: function(e) {
    var that = this;
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      wx.showToast({
        title: '拒绝授权',
        icon: 'none'
      })
    } else {
      wx.getUserInfo({
        success: function(res) {
          console.log(res)
          that.setData({
            rawData: res.rawData
          })
          that.wechatLogin();
        },
        fail: function() {

        }
      })
    }
  },
  getPhoneNumber: function(e) {
    var that = this;
    console.log(e)
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      that.close();
      // wx.request({
      //   url: 'http://localhost/index/users/decodePhone',
      //   data: {
      //     encryptedData: e.detail.encryptedData,
      //     iv: e.detail.iv,
      //     sessionKey: that.data.session_key,
      //     uid: "",
      //   },
      //   method: "post",
      //   success: function(res) {
      //     console.log(res);
      //   }
      // })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
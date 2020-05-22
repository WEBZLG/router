// pages/myself/myself.js
const app = getApp();
var ajax = require("../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    infoList: '',
    brokerageData: '',
    isRetail: false
  },
  // 我的定制
  myRouter() {
    ajax.checkLogin('您未登录无法查看', function() {
      wx.navigateTo({
        url: './myRouter/myRouter',
      })
    })
  },
  // 我的团员
  myMember() {
    ajax.checkLogin('您未登录无法查看', function() {
      wx.navigateTo({
        url: './myMember/myMember',
      })
    })
  },
  // 常用
  travelPeople() {
    ajax.checkLogin('您未登录无法查看', function() {
      var show = true;
      wx.navigateTo({
        url: '../router/travelPeople/travelPeople?show=' + show,
      })
    })
  },
  // 分销
  myRetail() {
    var that = this;
    ajax.checkLogin('您未登录无法查看', function() {
      if (that.data.isRetail == false) {
        wx.navigateTo({
          url: './retailLimit/retailLimit',
        })
      } else {
        wx.navigateTo({
          url: './myRetail/myRetail',
        })
      }
    })
  },
  // 客服
  serviceHelp() {
    wx.navigateTo({
      url: './serviceHelp/serviceHelp',
    })
  },
  // 关于
  about() {
    wx.navigateTo({
      url: './about/about',
    })
  },
  // 我的秒杀
  mySeckill() {
    ajax.checkLogin('您未登录无法查看', function() {
      wx.navigateTo({
        url: './mySeckill/mySeckill',
      })
    })
  },
  // 出行订单
  myorder() {
    ajax.checkLogin('您未登录无法查看', function() {
      wx.navigateTo({
        url: './myorder/myorder',
      })
    })
  },
  // 我的拼团
  groupBooking() {
    ajax.checkLogin('您未登录无法查看', function() {
      wx.navigateTo({
        url: './groupBooking/groupBooking',
      })
    })
  },
  // 佣金
  brokerage(uid) {
    var that = this;
    var item = {
      uid: uid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/brokerage', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            brokerageData: res.data,
            isRetail: true
          })
        }
        if (res.code == 400) {
          wx.hideLoading();
          that.setData({
            isRetail: false
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }

      },
      (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败' + err,
          icon: "none"
        })
      })
  },
  getInformation(uid) {
    var that = this;
    var item = {
      uid: uid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'User/myHomePage', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            infoList: res.data
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
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败' + err,
          icon: "none"
        })
      })
  },
  // 我的资料
  myHome: function() {
    ajax.checkLogin('您未登录无法查看', function() {
      wx.navigateTo({
        url: './myhome/myhome',
      })
    })
  },
  // 登录
  login: function() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  // 退出登录
  exit: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function(sm) {
        if (sm.confirm) {
          app.globalData.uid = null;
          wx.reLaunch({
            url: '../index/index',
          })
        } else if (sm.cancel) {
          wx.showToast({
            title: '已取消',
            icon: "none"
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var uid = app.globalData.uid
    this.setData({
      uid: uid
    })
    if (uid) {
      this.getInformation(uid);
      this.brokerage(uid);
    }
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
// pages/myself/withdrawDeposit/withdrawDeposit.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    takeOutList: '',
    moneyNum: '',
  },
  cashWithdrawals() {
    wx.navigateTo({
      url: '../cashWithdrawals/cashWithdrawals',
    })
  },
  moneyNum(e) {
    var money = e.detail.value;
    this.setData({
      moneyNum: money
    })
  },

  totalMoney() {
    var that = this;
    this.setData({
      moneyNum: that.data.takeOutList.sum
    })
  },

  submit(){
    var that = this;
    var item = {
      uid: app.globalData.uid,
      money: that.data.moneyNum,
      action: 'confirm'
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/takeOut', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
          });
          setTimeout(function(){
            that.onLoad();
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

  // 绑定微信
  bindAccount() {
    var that = this;
    wx.showModal({
      title: '授权账户',
      content: '确定授权账户？',
      cancelText: "取消",
      confirmText: "确定",
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: 'true'
          });
          wx.login({
            success(res) {
              //console.log(res);
              if (res.code) {
                var item = {
                  uid: app.globalData.uid,
                  code: res.code
                }
                ajax.wxRequest('POST', 'User/bdwx', item,
                  (res) => {
                    wx.hideLoading();
                    //console.log(res)
                    if (res.code == 200) {
                      wx.hideLoading();
                      wx.showToast({
                        title: '绑定成功！',
                      });
                      setTimeout(function(){
                        that.onLoad();
                      },2000)
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
              } else {
                //console.log('授权失败！' + res.errMsg)
              }
            }
          })
        } else {

        }
      }
    });

  },

  // 提现
  withdraw(uid) {
    var that = this;
    var item = {
      uid: uid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/takeOut', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            takeOutList: res.data
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
    var uid = app.globalData.uid
    this.withdraw(uid)
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
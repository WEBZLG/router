// pages/myself/openRetail/openRetail.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({


  /**
   * 页面的初始数据
   */
  data: {
    showId: '0',
    infoList: '',
    type: '1L'
  },
  checked(e) {
    console.log(e)
    var cid = e.currentTarget.dataset.cid;
    var type = e.currentTarget.dataset.type;
    this.setData({
      showId: cid,
      type: type
    })
  },
  openRetail() {
    var that = this;
    var uid = app.globalData.uid;
    wx.login({
      success(res) {
        if (res.code) {
          that.bindWx(uid, res.code)
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 绑定微信
  bindWx(uid, code) {
    var that = this;
    var item = {
      uid: uid,
      code: code
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/bdwx', item,
      (res) => {
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          var type = that.data.type;
          that.getInformation(uid, 'affirm', type)
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          });
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
  // 获取信息
  getInformation(uid, action, type) {
    var that = this;
    var item = {
      uid: uid,
      action: action,
      type: type
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'User/buy', item,
      (res) => {
        wx.hideLoading({
          mask: 'true'
        });
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          if (action == '') {
            that.setData({
              infoList: res.data
            });
          } else {
            var data = JSON.parse(res.data.parameters);
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.paySign,
              success(res) {
                wx.navigateBack({
                  detal:2
                })
              },
              fail(res) {
                wx.showToast({
                  title: res,
                  icon: "none"
                })
              }
            })
          }

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
    var uid = app.globalData.uid;
    this.getInformation(uid, '', '')
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
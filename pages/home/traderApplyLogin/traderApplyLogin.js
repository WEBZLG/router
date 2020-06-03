// pages/home/traderApplyLogin/traderApplyLogin.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: ''
  },
  login(){
    wx.reLaunch({
      url: '../../retailLogin/retailLogin',
    })
  },

  reApply(){
    wx.redirectTo({
      url: '../traderApply/traderApply',
    })
  },

  getData(uid, phone) {
    var that = this;
    var item = {
      'uid': uid,
      'phone': phone
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'User/apply_status', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 301) {
          wx.hideLoading();
          that.setData({
            dataList: res.data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    var uid = app.globalData.uid;
    var phone = options.phone;
    this.getData(uid, phone)
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
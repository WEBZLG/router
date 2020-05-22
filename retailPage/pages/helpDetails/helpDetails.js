// pages/myself/incomeDetails/incomeDetails.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: ''
  },

  // 获取
  getData(cid) {
    var that = this;
    var item = {
      customer_id: cid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'index/customerInfo', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          this.setData({
            dataList: res.data
          })
          WxParse.wxParse('content', 'html', res.data.content, that, 5);
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
    var that = this;
    var cid = options.cid;
    this.getData(cid)
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
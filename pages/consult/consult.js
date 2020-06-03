// pages/consult/consult.js
const app = getApp();
var ajax = require("../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: ""
  },
  goTv(){
    ajax.checkLogin('您未登录无法进入', function() {
      wx.navigateTo({
        url: './tvList/tvList',
      })
    })
  },
  consultList() {
    ajax.checkLogin('您未登录无法咨询', function() {
      wx.navigateTo({
        url: './consultList/consultList',
      })
    })
  },
  messageList() {
    ajax.checkLogin('您未登录无法查看', function () {
      wx.navigateTo({
        url: './messageList/messageList',
      })
    })
  },
  handleContact(e) {
    //console.log(e.detail.path)
    //console.log(e.detail.query)
  },

  getData(uid, type) {
    var that = this;
    var item = {
      uid: uid,
      type: type
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Chat/index', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList: res.data
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
    var uid = app.globalData.uid;
    this.getData(uid, 0)
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
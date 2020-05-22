// pages/router/addPeople/addPeople.js

const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{}
  },
 

  // 获取信息
  getdata(uid, userid) {
    var that = this;
    var item = {
      uid: uid,
      id: userid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/memberInfo', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          var data = res.data;
          that.setData({
            dataList:data
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
  onLoad: function (options) {
    var uid = app.globalData.uid;
    var userid = options.id;
    this.getdata(uid, userid)
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
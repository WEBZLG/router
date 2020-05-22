// retailPage/pages/unpassCheck/unpassCheck.js
const app = getApp()
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },
  orderDetails(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id='+id,
    })
  },
  getData(uid) {
    var that = this;
    var item = {
      'merchid': uid,
      'status': 0
    }
    wx.showLoading({ mask: 'ture' });
    ajax.wxRequest('POST', 'Merchant/orderList', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
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
    var uid = app.globalData.uid;
    this.getData(uid)
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
    var uid = app.globalData.uid;
    this.getData(uid, 1, 2)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var uid = app.globalData.uid;
    this.setData({
      page: that.data.page * 1 + 1
    })
    this.getData(uid, that.data.page, 2);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
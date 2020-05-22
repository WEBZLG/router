// pages/myself/expenseList/expenseList.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    dataList:[],
    date:"全部时间",
    time:'',
    nowDate: util.formatTime(new Date())
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      time: e.detail.value
    });
    var uid = app.globalData.uid;
    // var uid = 9;
    var page = this.data.page;
    var time = this.data.time;
    this.getData(uid, page, time);
  },
  // 获取消费列表
  getData(uid, page,time) {
    var that = this;
    var item = {
      uid: uid,
      page: page,
      time:time
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/payLog', item,
      (res) => {
        wx.hideLoading();
        console.log(res.data)
        if (res.code == 200) {
          var obj = res.data
          var arr = []
          for (let i in obj) {
            let o = {};
            o['key'] = i;
            o['value'] = obj[i]
            arr.push(o)
          }
          console.log(arr)
          that.setData({
            dataList: arr
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
    // var uid = 9;
    var page = this.data.page;
    var time = this.data.time;
    this.getData(uid, page,time);
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
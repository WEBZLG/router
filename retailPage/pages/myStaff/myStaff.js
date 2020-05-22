// pages/myself/myRetail/myRetail.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabShow: 0,
    uid: '',
    brokerageData: '',
    fansData: ''
  },

  // 员工详情
  staffDetails(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../staffDetails/staffDetails?id='+id,
    })
  },
  auditDetails(e) {
    var sid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../auditDetails/auditDetails?sid=' + sid,
    })
  },
  // 切换
  tabChange(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      tabShow: tab
    })
  },
  // 领队
  leader(uid) {
    var that = this;
    var item = {
      merchid: uid
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Merchant/staff', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            brokerageData: res.data
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
  // 待审核
  waitCheck(uid,page) {
    var that = this;
    var item = {
      merchid: uid,
      page:page
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Merchant/staffToPass', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            fansData: res.data
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
    var uid = app.globalData.uid
    this.setData({
      uid: uid
    })
    this.leader(uid);
    this.waitCheck(uid,'')
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
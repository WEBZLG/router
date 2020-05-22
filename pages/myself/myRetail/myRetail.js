// pages/myself/myRetail/myRetail.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabShow:0,
    uid:'',
    brokerageData:'',
    fansData:''
  },
  accumulatedIncome(){
    wx.navigateTo({
      url: '../accumulatedIncome/accumulatedIncome',
    })
  },
  openRetail(){
    wx.navigateTo({
      url: '../openRetail/openRetail',
    })
  },
  // 冻结
  blockedFund(){
    wx.navigateTo({
      url: '../blockedFund/blockedFund',
    })
  },
  // 提现
  withdrawDeposit(){
    wx.navigateTo({
      url: '../withdrawDeposit/withdrawDeposit',
    })
  },
  // 切换
  tabChange(e){
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      tabShow:tab
    })
  },
  // 佣金
  brokerage(uid) {
    var that = this;
    var item = {
      uid: uid
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'User/brokerage', item,
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
  // 粉丝
  fans(uid) {
    var that = this;
    var item = {
      uid: uid
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'User/myFans', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200 || res.code == 400) {
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
    this.brokerage(uid);
    this.fans(uid)
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
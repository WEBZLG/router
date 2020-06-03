// pages/myself/myinfo/myinfo.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: ''
  },
  infoShow(e){
    var url = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '../infoShow/infoShow?url='+url
    })
  },
  // 擅长
  goodAt: function () {
    wx.navigateTo({
      url: '../goodAt/goodAt',
    })
  },

  // 实名认证
  nameApprove: function () {
    wx.navigateTo({
      url: '../nameApprove/nameApprove',
    })
  },
  // 等待认证
  waitApprove: function () {
    wx.navigateTo({
      url: '../../waitApprove/waitApprove',
    })
  },
  // 认证成功
  successApprove: function () {
    wx.navigateTo({
      url: '../../successApprove/successApprove',
    })
  },
  // 旅游认证
  guideApprove: function () {
    wx.navigateTo({
      url: '../tourApprove/tourApprove',
    })
  },
  // 公司认证
  companyApprove: function () {
    wx.navigateTo({
      url: '../unitApprove/unitApprove',
    })
  },
  // 公司认证成功
  companySuccess: function (e) {
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../companySuccess/companySuccess?id=' + id + '&name=' + name,
    })
  },

  // 获取主页信息
  getInformation(uid) {
    var that = this;
    var item = {
      merchid: uid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'Merchant/info', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            infoList: res.data
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
    var uid = app.globalData.uid
    //console.log(uid)
    this.getInformation(uid);
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
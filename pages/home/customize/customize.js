// pages/home/customize/customize.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{}
   
  },

  // 定制
  customisedScheme(){
    wx.navigateTo({
      url: '../../myself/customisedScheme/customisedScheme',
    })
  },

  // 更多
  targetMore(){
    wx.navigateTo({
      url: '../destination/destination',
    })
  },
  // mudidi详情
  destinationDetails(e) {
    var id = e.currentTarget.dataset.id;
    // var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../destinationDetails/destinationDetails?id='+id
    })
  },

  // 深度
  deepTravel(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../deepTravel/deepTravel?id='+id,
    })
  },
  // 获取数据
  getInformation(uid) {
    var that = this;
    var item = {
      uid: uid,
    }
    wx.showLoading({ mask: "true" });
    ajax.wxRequest('POST', 'travel/privateTravel', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
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
    this.getInformation(uid)
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
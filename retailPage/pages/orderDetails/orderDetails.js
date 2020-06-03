const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    pubPath: ajax.resPath
  },
  paySuccess(e) {
    wx.navigateTo({
      url: '../paySuccess/paySuccess',
    })
  },
  // 获取订单列表
  getData(uid, oid) {
    var that = this;
    var item = {
      merchid: uid,
      oid: oid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Merchant/orderInfo', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList: res.data
          })
        } else if(res.code==400){
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          });
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },2000)
        }
        else{
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
    var oid = options.id;
    this.getData(uid, oid) 
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
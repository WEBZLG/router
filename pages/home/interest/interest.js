// pages/home/interest/interest.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList:[],
    pubPath:''
  },
  interestDetails(e){
    var id = e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: '../interestDetails/interestDetails?id='+id,
    })
  },


  // 获取信息
  getInformation(uid,sid) {
    var that = this;
    var item = {
      uid: uid,
      sid:sid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'travel/allBrowses', item,
      (res) => {
        wx.hideLoading({ mask: 'true' });
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
    var sid = options.sid;
    var uid = app.globalData.uid;
    this.getInformation(uid,sid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      pubPath: ajax.resPath
    })
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
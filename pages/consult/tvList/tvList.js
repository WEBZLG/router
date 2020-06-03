// pages/consult/tvList.js
var app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:'',
    dataAll:''
  },
  getData(uid){
    var that = this;
    var uid = app.globalData.uid;
    var item = {
      uid: uid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Index/getRoomList', item,
      (res) => {
        wx.hideLoading();
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataAll : res.data,
            dataList : res.data.room_info
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
  goTv(e){
    let roomId = e.currentTarget.dataset.roomid
    // let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 3 })) 
    wx.navigateTo({
        // url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
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
    this.getData(uid);
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
    this.getData(uid);
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
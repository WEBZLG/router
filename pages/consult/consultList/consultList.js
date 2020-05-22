// pages/consult/consultList/consultList.js
var app = getApp();
var ajax = require("../../../utils/ajax.js");
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'wss://travel.liaofankeji.com/wss';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    user_input_text: '',//用户输入文字
    inputValue: '',
    returnValue: '',
    addImg: false,
    allContentList: [],
    num: 0,
    dataList: []
  },
  consultDialog(e){
    var cid = e.currentTarget.dataset.id;
    var tid = e.currentTarget.dataset.toid;
    wx.navigateTo({
      url: '../consultDialog/consultDialog?id=' + cid+'&tid='+tid,
    })
  },
  getData(uid) {
    var that = this;
    var item = {
      uid: uid,
      type: 0
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Chat/chatList', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList: res.data
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
    this.getData(uid);
    // if (!socketOpen) {
    //   this.webSocket()
    // }
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
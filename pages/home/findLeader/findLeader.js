// pages/home/findLeader/findLeader.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    dataList:[]
  },
  // 搜索
  search(e) {
    var keyword = e.detail.value;
    this.setData({
      keyword: keyword
    })
  },
  searchbtn() {
    var keyword = this.data.keyword;
    if (keyword == '') {
      wx.showToast({
        title: '请输入关键字',
        icon: "none"
      })
    } else {
      this.getData(keyword,1)
    }
  },

  // 领队主页
  leaderHome(e){
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../leaderHome/leaderHome?uid='+uid,
    })
  },

  // 获取数据
  getData(keyword,page) {
    var that = this;
    var item = {
      'search': keyword,
      'page':page
    }
    wx.showLoading({ mask: 'ture' });
    ajax.wxRequest('POST', 'Index/guide', item,
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
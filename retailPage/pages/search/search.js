// pages/home/search/search.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    dataList: ''
  },
  // 旅行社主页
  travelHome(e) {
    //console.log(e)
    var cateid = e.currentTarget.dataset.cateid
    wx.navigateTo({
      url: '../travelHome/travelHome?aid=' + cateid,
    })
  },
  // 领队主页
  leaderApprove(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../leaderHome/leaderHome?uid=' + uid
    })
  },
  // 线路详情
  routerDetails(e) {
    var tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '../../router/routerDetails/routerDetails?tid=' + tid,
    })
  },
  // 历史搜索
  oldkey(e) {
    var keyword = e.currentTarget.dataset.kwd
    this.setData({
      keyword: keyword
    })
    this.getData(keyword);
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
    this.getData(keyword)
  },
  getData(keyword) {
    var that = this;
    var item = {
      'keyword': keyword
    }
    wx.showLoading({ mask: 'ture' });
    ajax.wxRequest('POST', 'Index/search', item,
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
    var keyword = options.keyword;
    this.setData({
      keyword: keyword
    })
    this.getData(keyword)
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
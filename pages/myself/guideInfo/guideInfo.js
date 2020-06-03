// pages/myself/guideInfo/guideInfo.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    search:'',
    page:1,
    tid:'',
    uid:'',
    resPath: ajax.resPath
  },
  search(e){
    this.setData({
      search:e.detail.value
    })
  },
  guideDetails(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../guideDetails/guideDetails?id='+id,
    })
  },
  searchbtn(){
    var that = this;
    var uid = that.data.uid;
    var tid = that.data.tid;
    var keyword = that.data.search;
    var page = that.data.page
    this.getData(uid,tid,keyword,page)

  },
  // 获取订单列表
  getData(uid, tid,search,page) {
    var that = this;
    var item = {
      uid: uid,
      tid: tid,
      search: search,
      page: page
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/scene', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
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
    var uid = app.globalData.uid;
    var tid = options.oid;
    //console.log(tid)
    this.setData({
      tid : tid,
      uid:uid
    })
    var search = this.data.search;
    this.getData(uid, tid, search, 1)
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
    //console.log('下')
    var that = this;
    var uid = that.data.uid;
    var tid = that.data.tid;
    var keyword = that.data.search;
    var page = that.data.page
    this.getData(uid, tid, keyword, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log('上')
    var that = this;
    var uid = that.data.uid;
    var tid = that.data.tid;
    var keyword = that.data.search;
    var page = that.data.page
    this.getData(uid, tid, keyword, page)
    this.setData({
      page:page*1+1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
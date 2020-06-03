// pages/myself/groupBooking/groupBooking.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    navScrollLeft: 0,
    pixelRatio: '',
    windowHeight: '',
    windowWidth: '',
    dataList: {}, //数据
    status: 0,
    page:1,
    keyword: ''
  },
  search(e){
    keyword:e.detail.value;
  },
  searchbtn(){
    var uid = app.globalData.uid;
    var status = this.data.status;
    var keyword = this.data.keyword;
    this.getData(uid, status, 1, keyword)
  },
  customizaDetails(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../customizaDetails/customizaDetails?id=' + id,
    })
  },
  // 订单详情
  orderDetails(e) {
    var id = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id=' + id,
    })
  },

  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    //console.log(event)
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },
  //点击切换
  clickTab: function (e) {
    var uid = app.globalData.uid;
    var idx = e.currentTarget.dataset.current;
    //console.log(idx)
    var that = this;
    if (idx == 0) {
      that.getData(uid, 0,1,'')
      that.setData({
        status: 0
      })
    } else if (idx == 1) {
      that.getData(uid, 3,1,'')
      that.setData({
        status: 3
      })
    } else if (idx == 2) {
      that.getData(uid, 2,1,'')
      that.setData({
        status: 2
      })
    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        keyword:''
      })
    }
  },
  // 获取订单列表
  getData(uid, status, page, keyword) {
    var that = this;
    var item = {
      merchid: uid,
      page: page,
      status: status,
      keyword: keyword
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Merchant/diyOrder', item,
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
    var status = this.data.status;
    var page = this.data.page;
    var keyword = this.data.keyword;
    this.getData(uid, status, page, keyword)
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
    var status = this.data.status;
    var page = this.data.page;
    var keyword = this.data.keyword;
    this.getData(uid, status, page, keyword)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var uid = app.globalData.uid;
    var status = this.data.status;
    var page = this.data.page;
    var keyword = this.data.keyword;
    this.getData(uid, status, page, keyword)
    this.setData({
      page: page+1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
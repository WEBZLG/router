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
    status: ''
  },
  // 分销记录
  expenseList() {
    wx.navigateTo({
      url: '../expenseList/expenseList',
    })
  },
  // 导览
  guideInfo() {
    wx.navigateTo({
      url: '../guideInfo/guideInfo',
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
    console.log(event)
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
    this.getData(cur + 1, '')
  },
  //点击切换
  clickTab: function (e) {
    // var uid = 9;
    var uid = app.globalData.uid;
    var idx = e.currentTarget.dataset.current;
    console.log(idx)
    var that = this;
    if (idx == 0) {
      that.getData(uid, '')
      that.setData({
        status: ''
      })
    } else if (idx == 1) {
      that.getData(uid, 0)
      that.setData({
        status: 0
      })
    } else if (idx == 2) {
      that.getData(uid, 2)
      that.setData({
        status: 2
      })
    } else if (idx == 3) {
      that.getData(uid, 4)
      that.setData({
        status: 4
      })
    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  // 获取订单列表
  getData(uid, status) {
    var that = this;
    var item = {
      merchid: uid,
      status: status
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Merchant/orderList', item,
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
  // 签到
  signUp(e) {
    var that = this;
    var uid = app.globalData.uid;
    var oid = e.currentTarget.dataset.oid;
    var item = {
      uid: uid,
      oid: oid,
      sign_up: '1'
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/orderCheckIn', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          var uid = app.globalData.uid;
          var status = that.data.status;
          that.getData(uid, status)
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
    var that = this;
    var uid = app.globalData.uid;
    console.log(options.type)
    if (options.type==1){
      that.setData({
        status: '',
        currentTab: 0
      })
      that.getData(uid, '');
    } else if (options.type==2){
      that.getData(uid, 2)
      that.setData({
        status: 2,
        currentTab:2
      })
    }
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
    var uid = app.globalData.uid;
    var status = this.data.status;
    this.getData(uid, status)
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
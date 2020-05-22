// pages/router/routerDetials/routerDetails.js
const app = getApp()
var ajax = require("../../../utils/ajax.js");
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelInfo: '',
    imgUrls: [],
    time: '请选择',
    currentTab: 0,
    startTime: '',
    price: '',
    place: '',
    tid: '',
    fixedNav: true
  },
  // 查看行程
  chooseTime(e) {
    var tid = this.data.tid;
    wx.navigateTo({
      url: '../datepicker/datepicker?tid=' + tid,
    })
  },
  // 我要分销
  wantRetail(e){
    var sid = e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: '../wantRetail/wantRetail?sid='+sid
    })
  },
  // 申请分销
  applyRetail(e){
    var sid = e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: '../applyRetail/applyRetail?sid=' + sid
    })
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  getData(tid) {
    var that = this;
    var uid = app.globalData.uid;
    var item = {
      'merchid':uid,
      'tid': tid
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'Merchant/productInfo', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            imgUrls: res.data.img,
            travelInfo: res.data
          });
          WxParse.wxParse('trip', 'html', res.data.trip, that, 5);
          WxParse.wxParse('content', 'html', res.data.content, that, 5);
          WxParse.wxParse('outlay', 'html', res.data.outlay, that, 5);
          WxParse.wxParse('tour_fee', 'html', res.data.tour_fee, that, 5);
          WxParse.wxParse('sign_notes', 'html', res.data.sign_notes, that, 5);
          WxParse.wxParse('equipment_notes', 'html', res.data.equipment_notes, that, 5);
          wx.setNavigationBarTitle({
            title: res.data.title
          })

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          });
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
    var tid = options.tid;
    this.setData({
      tid: tid,
      winHeight: wx.getSystemInfoSync().windowHeight,
    })
    console.log(options)
    this.getData(tid);
  },
  scroll(e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
    let query = wx.createSelectorQuery()
    query.select('.nav').boundingClientRect((rect) => {
      let top = rect.top
      if (top <= 0) { //临界值，根据自己的需求来调整
        this.setData({
          fixedNav: false //是否固定导航栏
        })
      } else {
        this.setData({
          fixedNav: true
        })
      }
    }).exec()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

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
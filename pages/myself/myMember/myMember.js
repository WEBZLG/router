// pages/myself/myMember/myMember.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabShow: 0,
    infoList:{},
    oldInfoList:[],
    tours:'0'
  },
  // 获取信息
  getInformation(uid) {
    var that = this;
    var item = {
      uid: uid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'User/tourMember', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            infoList: res.data,
            tours: res.data.tours
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

  // 往期团员
  getOldInformation(uid,page) {
    var that = this;
    var item = {
      uid: uid,
      page:page
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'User/pastPinkList', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            oldInfoList: res.data.pinkList,
            tours:res.data.count
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
  memberInfo(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../memberInfo/memberInfo?id='+id,
    })
  },

  // 切换
  tabChange(e) {
    var tab = e.currentTarget.dataset.tab;
    var uid = app.globalData.uid;
    this.setData({
      tabShow: tab
    })
    if(tab==0){
      this.getInformation(uid)
    }else{
      this.getOldInformation(uid,1);
    }
    //console.log(tab)
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
    // var uid = 16;
    this.getInformation(uid)
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
// retailPage/pages/accountList/accountList.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]
  },
  addAccount(){
    wx.navigateTo({
      url: '../addAccount/addAccount',
    })
  },

  check(e){
    var event = e.currentTarget.dataset;
    var pages = getCurrentPages(); // 获取页面栈
    var prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({
      accountName:event.name,
      account:event.id
    });
    wx.navigateBack({
      delta: 1
    })
  },

  getData(page){
    var that = this;
    var item = {
      'merchid': app.globalData.uid,
      'page': page
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'Merchant/userAccount', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          this.setData({
            dataList : res.data
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
    this.getData(1)
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
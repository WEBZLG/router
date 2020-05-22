// pages/retailHome/customizaDetails/customizaDetails.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList:'',
    did:''
  },
  otherCustomiza(){
    wx.navigateBack({
      detal:1
    })
  },
  // 接单,成交，未成交
  action(e){
    var action = e.currentTarget.dataset.act;
    var uid = app.globalData.uid;
    var did = this.data.did;
    this.getInformation(uid, did, action)
  },
  // 获取主页信息
  getInformation(uid, did, action) {
    var that = this;
    var item = {
      merchid: uid,
      diy_id:did,
      action: action
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'Merchant/diyInfo', item,
      (res) => {
        wx.hideLoading({ mask: 'true' });
        console.log(res)
        if (res.code == 200) {
          if(action==''){
            wx.hideLoading();
            that.setData({
              infoList: res.data
            });
          }else{
            wx.showToast({
              title: '操作成功',
            })
            setTimeout(function(){
              wx.navigateBack({
                detal:1
              })
            },1500)
          }

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
    var did = options.id;
    this.setData({
      did:did
    })
    var uid = app.globalData.uid;
    this.getInformation(uid, did,'')
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
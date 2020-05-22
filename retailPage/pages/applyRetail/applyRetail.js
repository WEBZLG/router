// pages/home/traderApplyCheck/traderApplyCheck.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: '',
    uid:'',
    sid:''
  },
  applybtn(){
    var uid = this.data.uid;
    var sid = this.data.sid;
    this.getData(uid, sid, 'confirm')
  },

  getData(uid, sid,action) {
    var that = this;
    var item = {
      'merchid': uid,
      'sp_id': sid,
      'action': action
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'Merchant/getApplyInfo', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          if (action == '') {
            that.setData({
              dataList: res.data
            });
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none"
            })
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
    var sid = options.sid;
    var uid = app.globalData.uid;
    this.setData({
      uid:uid,
      sid:sid
    })
    this.getData(uid, sid, '')
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
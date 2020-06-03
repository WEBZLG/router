// pages/retailHome/autitDetials/auditDetails.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:'',
    uid:'',
    sid:''
  },
  passBtn(){
    var that = this;
    wx.showModal({
      title: '通过认证',
      content: '确定通过认证？',
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          var uid = that.data.uid;
          var sid = that.data.sid;
          that.submit(uid, sid, 0) 
        } else {

        }
      }
    });
  },
  refuseBtn(){
    var that =this;
    wx.showModal({
      title: '拒绝认证',
      content: '确定拒绝认证？',
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          var uid = that.data.uid;
          var sid = that.data.sid;
          that.submit(uid, sid, 3) 
        } else {

        }
      }
    });
  },
  getData(uid, sid) {
    var that = this;
    var item = {
      'merchid': uid,
      'staff_id': sid
    }
    wx.showLoading({ mask: 'ture' });
    ajax.wxRequest('POST', 'Merchant/staffInfo', item,
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
  submit(uid, sid,status) {
    var that = this;
    var item = {
      'merchid': uid,
      'staff_id': sid,
      'status': status
    }
    wx.showLoading({ mask: 'ture' });
    ajax.wxRequest('POST', 'Merchant/staffInfo', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
          });
          setTimeout(function(){
            var uid = that.data.uid;
            var sid = that.data.sid;
            that.getData(uid, sid);
          },2000)

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
    var sid = options.sid;
    this.setData({
      uid:uid,
      sid:sid
    })
    this.getData(uid, sid);
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
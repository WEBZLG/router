// pages/myself/myCustom/myCustom.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    did:''
  },
  // 获取列表
  getData(uid,did) {
    var that = this;
    var item = {
      uid: uid,
      d_id:did
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/diyInfo', item,
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

  cancel(){
    var that = this;
    var uid = app.globalData.uid;
    var did = this.data.did;
    wx.showModal({
      title: '取消定制',
      content: '确定取消定制行程？',
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          var item = {
            uid: uid,
            d_id: did,
            action: 'cancel'
          }
          wx.showLoading({
            mask: 'true'
          });
          ajax.wxRequest('POST', 'User/diyInfo', item,
            (res) => {
              wx.hideLoading();
              //console.log(res)
              if (res.code == 200) {
                wx.hideLoading();
                wx.showToast({
                  title: '取消成功'
                });
                setTimeout(function(){
                  wx.navigateBack({
                    delta:1
                  })
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
        } else {

        }
      }
    });
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = app.globalData.uid;
    var did = options.did
    this.setData({
      did:did
    })
    // var uid = 9;
    // var did= 6;
    this.getData(uid, did);
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
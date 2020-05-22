// pages/retailPage/goodsName/goodsName.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList:'',
    id:'',
    tid:'',
    company:''
  },
  foreshowSeckill(e){
    var id = this.data.id;
    var tid = this.data.tid;
    var company = this.data.company
    wx.navigateTo({
      url: '../foreshowSeckill/foreshowSeckill?id=' + id + '&tid=' + tid + '&company=' + company,
    })
  },
  // 结束分销
  overRetail(){
    var that = this;
    var uid = app.globalData.uid;
    var id = this.data.id;
    wx.showModal({
      title: '结束分销',
      content: '确定结束分销？',
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          var item = {
            merchid: uid,
            id: id
          }
          wx.showLoading();
          ajax.wxRequest('POST', 'Merchant/endRetail', item,
            (res) => {
              wx.hideLoading({ mask: 'true' });
              console.log(res)
              if (res.code == 200) {
                wx.hideLoading();
                wx.showToast({
                  title: res.msg,
                  icon: "none"
                })
                setTimeout(function(){
                  wx.navigateBack({
                    detal:1
                  })
                },1500)

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
  // 获取主页信息
  getInformation(uid,tid) {
    var that = this;
    var item = {
      merchid: uid,
      id:tid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'Merchant/merchProductInfo', item,
      (res) => {
        wx.hideLoading({ mask: 'true' });
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            infoList: res.data,
            tid: res.data.travel_id,
            company: res.data.company
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
    })
    var uid = app.globalData.uid;
    this.getInformation(uid, id)
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
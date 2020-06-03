// pages/retailPage/seckillDetails/seckillDetails.js
const app = getApp()
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{},
    timeid:'',
    uid:'',
    sid:''
  },
// 秒杀订单详情
  seckillOrder(){
    wx.navigateTo({
      url: '../seckillOrder/seckillOrder',
    })
  },

  // 获取分类
  getData(uid,sid) {
    var that = this;
    var item = {
      merchid: uid,
      seckill_id:sid
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Merchant/seckillInfo', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList:res.data
          })
          var time = res.data.start_time.time;
          if (time =='00:00:00'){
            that.setData({
              timeid:0
            })
          } else if (time == '08:00:00'){
            that.setData({
              timeid: 1
            })
          }
          else if (time == '12:00:00') {
            that.setData({
              timeid: 2
            })
          }
          else if (time == '16:00:00') {
            that.setData({
              timeid: 3
            })
          }
          else if (time == '20:00:00') {
            that.setData({
              timeid: 4
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

  // 取消
  cancel() {
    var that = this;
    var uid = this.data.uid;
    var sid = this.data.sid;
    wx.showModal({
      title: '撤销秒杀',
      content: '确定撤销秒杀？',
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          var item = {
            merchid:uid,
            seckill_id: sid
          }
          wx.showLoading({ mask: 'true' });
          ajax.wxRequest('POST', 'Merchant/delSeckill', item,
            (res) => {
              wx.hideLoading();
              //console.log(res)
              if (res.code == 200) {
                wx.hideLoading();
                wx.showToast({
                  title: '撤销成功',
                });
                setTimeout(function () {
                  wx.navigateBack({
                    detal:1
                  })
                }, 2000)
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
    var sid = options.sid;
    var uid = app.globalData.uid;
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
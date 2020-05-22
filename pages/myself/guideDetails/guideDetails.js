// pages/myself/guideDetails/guideDetails.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
const myaudio = wx.createInnerAudioContext({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{},
    currenTime:'',
    duration:''
  },
  audioPlay() {
    myaudio.play();
  },
  audioPause() {
    myaudio.pause();
  },
  //将秒转化为时分秒
  formateSeconds(endTime) {
    let secondTime = parseInt(endTime)//将传入的秒的值转化为Number
    let min = 0// 初始化分
    let h = 0// 初始化小时
    let result = ''
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      min = parseInt(secondTime / 60)//获取分钟，除以60取整数，得到整数分钟
      secondTime = parseInt(secondTime % 60)//获取秒数，秒数取佘，得到整数秒数
      if (min > 60) {//如果分钟大于60，将分钟转换成小时
        h = parseInt(min / 60)//获取小时，获取分钟除以60，得到整数小时
        min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
      }
    }
    result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
    return result
  },
  // 获取订单列表
  getData(uid, sceneId) {
    var that = this;
    var item = {
      uid: uid,
      scene_id: sceneId,
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/sceneInfo', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList: res.data
          });
          myaudio.src = res.data.speech;
          that.audioPlay()
          setTimeout(() => {
            myaudio.currentTime
            myaudio.onTimeUpdate(() => {
              var duration = Math.ceil(myaudio.duration)
              var currenTime = Math.ceil(myaudio.currentTime)
              that.setData({
                duration:that.formateSeconds(duration),
                currenTime: that.formateSeconds(currenTime)
              })
            })
          }, 500)
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
    // var uid = 9;
    var id = options.id;
    this.getData(uid, id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('Audio')	
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
    this.audioPause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.audioPause();
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
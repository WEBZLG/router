// pages/foreshowSeckill/foreshowSeckill.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: '',
    infoList: '',
    seckillPrice: '',
    number: '',
    startTime: '',
    termId: '',
    id: '',
    time: '',
    timeid: 0,
    nowTime:'',
    date:'',
    hour:'00:00:00'
  },
  seckillPrice(e) {
    this.setData({
      seckillPrice: e.detail.value
    })
  },
  number(e) {
    this.setData({
      number: e.detail.value
    })
  },
  chooseHour(e) {
    var that = this;
    var timeid = e.currentTarget.dataset.timeid;
    var hour = e.currentTarget.dataset.time;
    this.setData({
      timeid: timeid,
      hour:hour,
      time:that.data.date +' '+ hour
    })
  },
  bindDateChange: function (e) {
    var that = this;
    var time = e.detail.value +' '+ that.data.time
    this.setData({
      date: e.detail.value,
      time: time
    })
  },
  chooseTime(e) {
    var tid = this.data.tid;
    wx.navigateTo({
      url: '../datepicker/datepicker?tid=' + tid,
    })
  },

  submit() {
    var that = this;
    var uid = app.globalData.uid;
    var aid = this.data.id;
    var tid = this.data.tid;
    var price = this.data.seckillPrice;
    var num = this.data.number;
    var time = this.data.time;
    var termId = this.data.termId;
    if (termId == '') {
      wx.showToast({
        title: '请选择排期',
        icon: 'none'
      })
    } else if (price == '') {
      wx.showToast({
        title: '请输入秒杀价',
        icon: 'none'
      })
    } else if (num == '') {
      wx.showToast({
        title: '请输入数量',
        icon: 'none'
      })
    } else if (time == '') {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none'
      })
    } else {
      that.getInformation(uid, aid, 'confirm', tid, price, num,time)
    }
  },

  // 获取主页信息
  getInformation(uid, aid, action, term_id, price, num, start_time) {
    var that = this;
    var item = {
      merchid: uid,
      aid: aid,
      action: action,
      term_id: term_id,
      price: price,
      num: num,
      start_time: start_time
    }
    //console.log(item)
    wx.showLoading();
    ajax.wxRequest('POST', 'Merchant/setSeckill', item,
      (res) => {
        wx.hideLoading({
          mask: 'true'
        });
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          if (action == '') {
            that.setData({
              infoList: res.data
            });
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none"
            })
            setTimeout(function() {
              wx.navigateBack({
                detal: 1
              })
            }, 1500)
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
  onLoad: function(options) {
    var uid = app.globalData.uid;
    var id = options.id;
    var tid = options.tid;
    this.setData({
      company: options.company,
      tid: tid,
      id: id
    })
    this.getInformation(uid, id, '', tid, '', '', '')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var time = util.formatTime(new Date())
    this.setData({
      nowTime: time,
      date:time,
      time:time +' '+ that.data.hour
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
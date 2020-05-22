// pages/retailHome/retailHome.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
var util = require("../../../utils/util.js")
Component({

  /* 开启全局样式设置 */
  options: {
    addGlobalClass: true,
  },

  /* 组件的属性列表 */
  properties: {

  },

  /* 组件的初始数据 */
  data: {
    infoList: [],
    nowTime:''
  },

  /* 组件声明周期函数 */
  lifetimes: {
    attached: function() {
      var time = util.formatTime(new Date())
      this.setData({
        nowTime:time
      })
      var uid = app.globalData.uid;
      this.getInformation(uid)
    },
    moved: function() {

    },
    detached: function() {

    },
  },
  // 组件所在页面的生命周期函数
  pageLifetimes: {
    show: function () {
      var uid = app.globalData.uid;
      this.getInformation(uid)
    },
    hide: function () { },
    resize: function () { },
  },
  /* 组件的方法列表 */
  methods: {
    // 待审核
    toAudit() {
      wx.navigateTo({
        url: '../toAudit/toAudit',
      })
    },
    // 新定制
    newCustomization() {
      wx.navigateTo({
        url: '../newCustomization/newCustomization',
      })
    },
    // 新订单
    newOrder() {
      wx.navigateTo({
        url: '../newOrder/newOrder',
      })
    },
    // 新产品
    newMarket() {
      wx.navigateTo({
        url: '../newMarket/newMarket',
      })
    },
    // 新分销
    newRetail() {
      wx.navigateTo({
        url: '../newRetail/newRetail',
      })
    },
    // 秒杀团
    newSeckill() {
      wx.navigateTo({
        url: '../newSeckill/newSeckill',
      })
    },
    // 待结算
    settlement(){
      wx.navigateTo({
        url: '../myOrder/myOrder?type='+'2',
      })
    },
    // 获取主页信息
    getInformation(uid) {
      var that = this;
      var item = {
        merchid: uid
      }
      wx.showLoading();
      ajax.wxRequest('POST', 'Merchant/index', item,
        (res) => {
          wx.hideLoading();
          console.log(res)
          if (res.code == 200) {
            wx.hideLoading();
            that.setData({
              infoList: res.data
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

  }

})
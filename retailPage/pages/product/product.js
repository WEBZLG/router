// pages/retailPage/product/product.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")

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
    infoList: []
  },

  /* 组件声明周期函数 */
  lifetimes: {
    created:function(){
      var uid = app.globalData.uid
      this.getInformation(uid);
    },
    attached: function () {

    },
    moved: function () {

    },
    detached: function () {

    },
  },
    // 组件所在页面的生命周期函数
  pageLifetimes: {
    show: function () { },
    hide: function () { },
    resize: function () { },
  },

  /* 组件的方法列表 */
  methods: {
// 单审核
  waitCheck(){
    wx.navigateTo({
      url: '../waitCheck/waitCheck',
    })
  },
// 未通过
  unpassCheck() {
    wx.navigateTo({
      url: '../unpassCheck/unpassCheck',
    })
  },
  // 市场
  market() {
    wx.navigateTo({
      url: '../market/market',
    })
  },
  // 分销产品
  retailGoods() {
    wx.navigateTo({
      url: '../retailGoods/retailGoods',
    })
  },
  // 秒杀产品
  seckillGoods() {
    wx.navigateTo({
      url: '../seckillGoods/seckillGoods',
    })
  },
    undercarriage() {
      wx.navigateTo({
        url: '../undercarriage/undercarriage',
      })
    },
    // 获取主页信息
    getInformation(uid) {
      var that = this;
      var item = {
        merchid: uid
      }
      wx.showLoading();
      ajax.wxRequest('POST', 'Merchant/productIndex', item,
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
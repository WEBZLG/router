// pages/myself/myself.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
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
    uid: '',
    brokerageData: '',
    isRetail: false
  },

  /* 组件声明周期函数 */
  lifetimes: {
    created: function() {
      var uid = app.globalData.uid
      this.getInformation(uid);
    },
    attached: function() {

    },
    moved: function() {

    },
    detached: function() {

    },
  },
  // 组件所在页面的生命周期函数
  pageLifetimes: {
    show: function() {
      var uid = app.globalData.uid
      this.getInformation(uid);
    },
    hide: function() {},
    resize: function() {},
  },

  /* 组件的方法列表 */
  methods: {
    getInformation(uid) {
      var that = this;
      var item = {
        merchid: uid
      }
      wx.showLoading();
      ajax.wxRequest('POST', 'Merchant/my', item,
        (res) => {
          wx.hideLoading();
          //console.log(res)
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
    seckillGoods(){
      wx.navigateTo({
        url: '../seckillGoods/seckillGoods',
      })
    },
    // 我的资料
    myHome: function(e) {
      var name = e.currentTarget.dataset.name
      wx.navigateTo({
        url: '../myHome/myHome?name='+name,
      })
    },
    // 我的员工
    myStaff: function () {
      wx.navigateTo({
        url: '../myStaff/myStaff',
      })
    },
    // 我的客人
    myVisitor: function() {
      wx.navigateTo({
        url: '../myVisitor/myVisitor',
      })
    },
    // 我的订单管理
    myOrder: function() {
      wx.navigateTo({
        url: '../myOrder/myOrder?type='+'1',
      })
    },
    // 帮助
    serviceHelp() {
      wx.navigateTo({
        url: '../serviceHelp/serviceHelp',
      })
    },
    // 关于
    about() {
      wx.navigateTo({
        url: '../about/about',
      })
    },
    // 我的分销
    myRetail() {
      wx.navigateTo({
        url: '../myRetail/myRetail',
      })
    },
    // 私人订单
    personalTailor(){
      wx.navigateTo({
        url: '../personalTailor/personalTailor',
      })
    },
    // 我的数据
    lineData() {
      wx.navigateTo({
        url: '../lineData/lineData',
      })
    },
    mySupplier() {
      wx.navigateTo({
        url: '../mySupplier/mySupplier',
      })
    },
    // 退出登录
    exit: function() {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: function(sm) {
          if (sm.confirm) {
            app.globalData.uid = null;
            wx.reLaunch({
              url: '../../../pages/index/index',
            })
          } else if (sm.cancel) {
            wx.showToast({
              title: '已取消',
              icon: "none"
            })
          }
        }
      })

    },

  }

})
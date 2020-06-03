// pages/consult/consult.js
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
    dataList: ""
  },

  /* 组件声明周期函数 */
  lifetimes: {
    created: function () {
      var uid = app.globalData.uid;
      this.getData(uid, 0)
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
    show: function () {
      var uid = app.globalData.uid;
      this.getData(uid, 0)
    },
    hide: function () { },
    resize: function () { },
  },

  /* 组件的方法列表 */
  methods: {
    consultList() {
      //console.log(9999)
      // ajax.checkLogin('您未登录无法咨询', function () {
      wx.navigateTo({
        url: '../consultList/consultList',
      })
      // })
    },
    handleContact(e) {
      //console.log(e.detail.path)
      //console.log(e.detail.query)
    },

    getData(uid, type) {
      var that = this;
      var item = {
        uid: uid,
        type: type
      }
      wx.showLoading({
        mask: 'true'
      });
      ajax.wxRequest('POST', 'Chat/index', item,
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

  }

})


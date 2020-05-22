const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [],
    contentData: [],
    currentTab: 0,
    navScrollLeft: 0,
    pixelRatio: '',
    windowHeight: '',
    windowWidth: '',
    cid: '',
    page: 1
  },
  // 详情列表
  supplier(e){
    var aid = e.currentTarget.dataset.aid;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../supplier/supplier?aid=' + aid+'&name='+name,
    })
  },
  
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    console.log(event)
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
    console.log(cur)
    if (cur == 0) {
      this.setData({
        cid: '',
      });
      this.getData(cur, 1)
    } else {
      this.setData({
        cid: cur,
      });
      this.getData(cur, 1)
    }
  },
  getType(e) {
    var that = this;
    var item = {}
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Index/getCategory', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          var navdata = res.data.unshift({ id: 0, name: '推荐' })
          that.setData({
            navData: res.data,
          });
          console.log(that.data.navData)
          that.getData('', 1);
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
  getData(cid, page) {
    var that = this;
    var item = {
      merchid: app.globalData.uid,
      // merchid: 2,
      cid: cid,
      // page: page
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Merchant/supply', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            contentData: res.data
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
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });

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
    this.getType();
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
    var cid = this.data.cid;
    this.getData(cid, 1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page;
    page = page + 1;
    this.getData(cid, page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/retailPage/market/market.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [],
    keyword: '',
    companyArray: ['全部', '已分销', '未分销'],
    typeArray: ['分类'],
    timeArray: ['上架时间', '时间升序', '时间降序'],
    popularArray: ['状态', '已上架', '已下架'],
    companyIdx: 0,
    typeIdx: 0,
    timeIdx: 0,
    popularIdx: 0,
    company: '',
    type: '',
    time: '',
    popular: '',
    sid: '',
    companyName: ''
  },
  bindCompanyChange: function(e) {
    var that = this;
    var idx = e.detail.value;
    this.setData({
      companyIdx: idx,
    });
    var uid = app.globalData.uid;
    if (idx == 0) {
      that.setData({
        company: ''
      });
      that.getInformation(uid, idx, '1', '', that.data.sid, that.data.time, that.data.popular);
    } else {
      that.setData({
        company: idx
      });
      that.getInformation(uid, that.data.type, '1', idx, that.data.sid, that.data.time, that.data.popular);
    }


  },
  bindTypeChange: function(e) {
    var that = this;
    var idx = e.detail.value;
    this.setData({
      typeIdx: idx,
    });
    var uid = app.globalData.uid;
    if (idx == 0) {
      that.setData({
        type: ''
      });
      that.getInformation(uid, '', '1', that.data.company, that.data.sid, that.data.time, that.data.popular);
    } else {
      that.setData({
        type: idx
      });
      that.getInformation(uid, idx, '1', that.data.company, that.data.sid, that.data.time, that.data.popular);
    }

  },
  bindTimeChange: function(e) {
    var that = this;
    var idx = e.detail.value;
    this.setData({
      timeIdx: e.detail.value
    });
    var uid = app.globalData.uid;
    if (idx) {
      that.getInformation(uid, that.data.type, '1', that.data.company, that.data.sid, '', that.data.popular);
      that.setData({
        time: ''
      })
    } else if (idx == 1) {
      that.getInformation(uid, that.data.type, '1', that.data.company, that.data.sid, 'asc', that.data.popular);
      that.setData({
        time: 'asc'
      })
    } else {
      that.getInformation(uid, that.data.type, '1', that.data.company, that.data.sid, 'desc', that.data.popular);
      that.setData({
        time: 'desc'
      })
    }
  },
  bindPopularChange: function(e) {
    var that = this;
    var idx = e.detail.value;
    this.setData({
      popularIdx: e.detail.value
    });
    var uid = app.globalData.uid;
    if (idx == 0) {
      that.setData({
        popular: ''
      })
      that.getInformation(uid, that.data.type, '1', that.data.company, that.data.sid, that.data.time, '');
    } else if (idx == 1) {
      that.setData({
        popular: '0'
      })
      that.getInformation(uid, that.data.type, '1', that.data.company, that.data.sid, that.data.time, '0');
    } else {
      that.setData({
        popular: '1'
      })
      that.getInformation(uid, that.data.type, '1', that.data.company, that.data.sid, that.data.time, '1');
    }
  },

  // 详情
  supplierDetails(e) {
    var aid = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '../supplierDetails/supplierDetails?id=' + aid,
    })
  },
  marketDetails(e) {
    var tid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../marketDetails/marketDetails?tid=' + tid,
    })
  },
  // 搜索
  search(e) {
    var keyword = e.detail.value;
    this.setData({
      keyword: keyword
    })
  },
  searchbtn() {
    var that = this;
    var keyword = that.data.keyword;
    if (keyword == '') {
      wx.showToast({
        title: '请输入关键字',
        icon: "none"
      })
    } else {
      wx.navigateTo({
        url: '../search/search?keyword=' + keyword,
      })
    }
  },
  // 获取主页信息
  getInformation(uid, cid, page, type, sid, time, status) {
    var that = this;
    var item = {
      merchid: uid,
      cid: cid,
      page: page,
      type: 1,
      supp_id: sid,
      time: time,
      status: status
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'Merchant/supplyProduct', item,
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
  // 获取分类
  getType(e) {
    var that = this;
    var item = {}
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Index/getCategory', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          var dataList = res.data;
          for (var idx in dataList) {
            that.setData({
              typeArray: that.data.typeArray.concat(dataList[idx].name),
              navData: dataList
            });
          }
          console.log(that.data.typeArray)
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
    var id = options.aid;
    var name = options.name
    this.setData({
      sid: id,
      companyName: name
    })
    this.getType();
    var uid = app.globalData.uid;
    this.getInformation(uid, '', 1, '', id, '', '');

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
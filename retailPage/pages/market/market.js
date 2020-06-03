// pages/retailPage/market/market.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData:[],
    keyword:'',
    companyArray:['供应商'],
    typeArray:['分类'],
    timeArray: ['时间', '时间升序','时间降序'],
    popularArray: ['人气', '人气升序','人气降序'],
    companyIdx:0,
    typeIdx:0,
    timeIdx:0,
    popularIdx:0,
    company:'',
    type:'',
    time:'',
    popular:''
  },
  bindCompanyChange: function (e) {
    var that = this;
    var idx = e.detail.value;
    this.setData({
      companyIdx: idx,
    });
    var uid = app.globalData.uid;
    if(idx==0){
      that.setData({
        company: ''
      });
      that.getInformation(uid,'', that.data.type, that.data.time, that.data.popular, '');
    }else{
      that.setData({
        company: idx
      });
      that.getInformation(uid, idx, that.data.type, that.data.time, that.data.popular, '');
    }

    
  },
  bindTypeChange: function (e) {
    var that = this;
    var idx = e.detail.value;
    this.setData({
      typeIdx:idx,
    });
    var uid = app.globalData.uid;
    if(idx==0){
      that.setData({
        type: ''
      });
      that.getInformation(uid, '', that.data.time, that.data.popular, '');
    }else{
      that.setData({
        type: idx
      });
      that.getInformation(uid, idx, that.data.time, that.data.popular, '');
    }

  },
  bindTimeChange: function (e) {
    var that = this;
    var idx = e.detail.value;
    this.setData({
      timeIdx: e.detail.value
    });
    var uid = app.globalData.uid;
    if(idx){
      that.getInformation(uid, that.data.type, '', that.data.popular, '');
      that.setData({
        time:''
      })
    }else if(idx==1){
      that.getInformation(uid, that.data.type, 'read', that.data.popular, '');
      that.setData({
        time: 'read'
      })
    }else{
      that.getInformation(uid, that.data.type, 'time', that.data.popular, '');
      that.setData({
        time: 'time'
      })
    }
  },
  bindPopularChange: function (e) {
    var that = this;
    var idx = e.detail.value;
    this.setData({
      popularIdx: e.detail.value
    });
    var uid = app.globalData.uid;
    if(idx==0){
      that.setData({
        popular:''
      })
      that.getInformation(uid, that.data.type, that.data.time, '', '');
    }else if(idx==1){
      that.setData({
        popular: 'asc'
      })
      that.getInformation(uid, that.data.type, that.data.time,'asc', '');
    }else{
      that.setData({
        popular: 'desc'
      })
      that.getInformation(uid, that.data.type, that.data.time, 'desc', '');
    }
  },

  // 产品详情
  marketDetails(e){
    var tid = e.currentTarget.dataset.id;
    //console.log(tid)
    wx.navigateTo({
      url: '../marketDetails/marketDetails?tid='+tid,
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
  getInformation(uid,companyid,cid,field,order,keyword) {
    var that = this;
    var item = {
      merchid: uid,
      cid:cid,
      field: field,
      order: order,
      keyword: keyword,
      company_id:companyid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'Merchant/market', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            infoList: res.data.list
          });
          var company = res.data.company;
          that.setData({
            companyArray: ['供应商']
          })
          for(var idx in company){
            that.setData({
              companyArray: that.data.companyArray.concat(company[idx].name)
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
  // 获取分类
  getType(e) {
    var that = this;
    var item = {}
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Index/getCategory', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          var dataList = res.data;
          that.setData({
            typeArray:['分类']
          })
          for (var idx in dataList){
            that.setData({
              typeArray: that.data.typeArray.concat(dataList[idx].name),
              navData:dataList
            });
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
  onLoad: function (options) {
    this.getType();
    var uid = app.globalData.uid;
    this.getInformation(uid, '', '', '', '', '')
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
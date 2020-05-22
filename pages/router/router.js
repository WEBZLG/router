// pages/router/router.js
const app = getApp()
var ajax = require("../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [],
    contentData:[],
    currentTab: 0,
    navScrollLeft: 0,
    pixelRatio:'',
    windowHeight:'',
    windowWidth:'',
    cid:'',
    keyword:'',
    page:1,
    cur:'',
    newCurrentTab:''
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
    ajax.checkLogin('您未登录无法搜索', function () {
      var keyword = that.data.keyword;
      if (keyword == '') {
        wx.showToast({
          title: '请输入关键字',
          icon: "none"
        })
      } else {
        wx.navigateTo({
          url: '../home/search/search?keyword=' + keyword,
        })
      }
    });
  },
  // 线路详情
  routerDetails(e){
    console.log(e)
    var tid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './routerDetails/routerDetails?tid='+tid,
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
    var that =this;
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
    if(cur==0){
      that.getData('', 1)
      that.setData({
        cur:''
      })
    }else{
      that.getData(cur,1)
      that.setData({
        cur: cur
      })
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
          var navdata = res.data.unshift({ id: 0, name: '热门推荐' })
          that.setData({
            navData: res.data
          });
          if (app.globalData.switchid==null){
            that.getData('', 1);  
          }else{
            that.setData({
              currentTab: app.globalData.switchid
            })
            that.getData(app.globalData.switchid, 1); 
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
  getData(cid,page) {
    var that = this;
    var item = {
      cid:cid,
      page:page
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Index/getTrip', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            contentData: res.data
          });
          app.globalData.switchid=null;
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
    this.setData({
      page:1
    })
    this.getData(this.data.cur, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(this.data.cur, this.data.page)
    this.setData({
      page: page * 1 + 1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
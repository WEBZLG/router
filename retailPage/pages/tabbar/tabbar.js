let app = getApp()

Page({
  data: {
    currentTab: 0,
    items: [
      {
        "iconPath": "../../../images/Rall.png",
        "selectedIconPath": "../../../images/Rall1.png",
        "text": "首页"
      },
      {
        "iconPath": "../../../images/Rcalendar.png",
        "selectedIconPath": "../../../images/Rcalendar1.png",
        "text": "产品"
      },
      {
        "iconPath": "../../../images/Rhelp.png",
        "selectedIconPath": "../../../images/Rhelp1.png",
        "text": "咨询"
      },
      {
        "iconPath": "../../../images/RSmile.png",
        "selectedIconPath": "../../../images/RSmile1.png",
        "text": "我的"
      }
    ]
  },
  swichNav: function (e) {
    let that = this;
    var idx = e.currentTarget.dataset.current;
    if(idx==0){
      wx.setNavigationBarTitle({
        title: '趣游'
      })
    }else if(idx==1){
      wx.setNavigationBarTitle({
        title: '产品'
      })
    } else if (idx == 2) {
      wx.setNavigationBarTitle({
        title: '咨询'
      })
    } else if (idx == 3) {
      wx.setNavigationBarTitle({
        title: '我的'
      })
    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onReady: function () {
    wx.hideHomeButton();
  },
  onLoad: function (option) {
    
  },
  onShow:function(){
    wx.hideHomeButton();
  },
  toAudit(){
    console.log('chufale');
    wx.navigateTo({
      url: '../retailPage/toAudit/toAudit',
    })
  }
})

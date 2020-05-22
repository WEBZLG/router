// pages/router/travelPeople/travelPeople.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleList:[],
    choosePerson:'',
    checkShow:false
  },
  checkboxChange: function (e) {
    console.log(e)
    var arr = e.detail.value;
    this.setData({
      choosePerson: arr
    })
  },
  // 编辑信息
  editPeople(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../changePeople/changePeople?id='+id,
    })
  },

  getinfo(e){
    console.log(e)
  },
  chooseOk(){
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    //不需要页面更新
    prevPage.setData({
      choosePerson: that.data.choosePerson
    });
    wx.navigateBack();
  },
  addPeople(){
    wx.navigateTo({
      url: '../addPeople/addPeople',
    })
  },
  peopleList(uid){
    var that = this;
    var item = {
      uid:uid
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'User/usedInformation', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            peopleList: res.data
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
    console.log(options.show)
    if(options.show =="true"){
      this.setData({
        checkShow:true
      })
      console.log(this.data.checkShow)
    }
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
    var uid = app.globalData.uid;
    // var uid = 16;
    this.peopleList(uid)
    this.setData({
      choosePerson: []
    })
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
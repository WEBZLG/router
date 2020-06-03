// pages/myself/withdrawDeposit/withdrawDeposit.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    takeOutList: '',
    haveMoney:'',
    account:'',
    accountName:''
  },
  accountList(){
    wx.navigateTo({
      url: '../accountList/accountList',
    })
  },
  cashWithdrawals(){
    wx.navigateTo({
      url: '../cashWithdrawals/cashWithdrawals',
    })
  },
  bindmoney(e){
    var money = e.detail.value;
    this.setData({
      money:money
    })
  },
  total(){
    var that = this;
    this.setData({
      money: that.data.haveMoney
    })
  },
  submit(){
    var that = this;
    var account = this.data.account;
    var money = this.data.money;
    var uid = app.globalData.uid;
    if(account==''){
      wx.showToast({
        title: '请选择提现账户',
        icon:"none"
      })
      return false;
    }else if(money==0||money==''){
      wx.showToast({
        title: '提现金额不能为空活0',
        icon: "none"
      })
      return false;
    }else{
      that.withdraw(uid, money, 'confirm')
    }
  },
  // 提现
  withdraw(uid, money, action) {
    var that = this;
    var item = {
      merchid: uid,
      money: money,
      action: action
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Merchant/withdrawal', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          if (action==''){
            that.setData({
              takeOutList: res.data,
              haveMoney: res.data.sum
            })
          }else{
            wx.showToast({
              title: res.msg,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.withdraw(uid,'','')
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
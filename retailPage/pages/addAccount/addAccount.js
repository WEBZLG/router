// retailPage/addAccount/addAccount.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    number:'',
    type:'1',
    typeArray:['商户','个人'],
    index:0
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      type: e.detail.value*1+1
    })
  },
  number(e){
    this.setData({
      number:e.detail.value
    })
  },
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  type(e) {
    this.setData({
      type: e.detail.value
    })
  },
  submit() {
    var that = this;
    var uid = app.globalData.uid;
    var account = this.data.number;
    var name = this.data.name;
    var type = this.data.type;
    if(account==''){
      wx.showToast({
        title: '请输入您的商户号或微信号',
        icon:'none'
      });
      return false;
    }else if(name==''){
      wx.showToast({
        title: '请输入您的商户名称或姓名',
        icon: 'none'
      });
      return false;
    }

    var item = {
      'merchid': uid,
      'account': account,
      'name': name,
      'type': type
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'Merchant/addAccount', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: res.msg
          });
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2000)
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
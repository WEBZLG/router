// pages/myself/tourApprove/tourApprove.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['导游证'],
    type: '请选择',
    descript: '',
    images: '',
    iconIsShow: false
  },
  bindPickerChange: function(e) {
    var index = e.detail.value;
    var array = this.data.array;
    this.setData({
      type: array[index]
    })
  },

  bindinput: function(e) {
    this.setData({
      descript: e.detail.value
    });
  },
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        this.setData({
          images: res.tempFilePaths[0],
          iconIsShow: true
        })
      }
    })
  },
  deleteImg(e) {
    this.setData({
      images: '',
      iconIsShow: false
    });
  },
  submitForm(e) {
    var that = this;
    const type = this.data.type;
    const descript = this.data.descript;
    const images = this.data.images;

    if (images && descript && type!='请选择') {
      wx.showLoading({mask:"true"})
      ajax.uploadimg(images,function(res){
        var item = {
          uid: app.globalData.uid,
          info: descript,
          pic_guide: res.path,
          guide_type: type
        }
        ajax.wxRequest('POST', 'User/certified', item,
          (res) => {
            //console.log(res)
            if (res.code == 400) {
              wx.showToast({
                title: res.msg,
                icon:"none"
              })
              setTimeout(function(){
                wx.hideLoading();
                wx.navigateBack();
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
      })
    } else {
      wx.showToast({
        title: '请填写完整数据',
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
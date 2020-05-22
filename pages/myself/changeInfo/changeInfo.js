// pages/myself/changeInfo/changeInfo.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: '',
    region: [],
    sex:'',
    nickName:'',
    country: '',
    province: '',
    city: '',
    array:['男','女'],
    sex:'',
    sexnum:''
  },
  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      sex: that.data.array[e.detail.value],
      sexnum: e.detail.value*1+1
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      country: e.detail.value[0],
      province: e.detail.value[1],
      city: e.detail.value[2]
    })
  },
  nickName(e){
    this.setData({
      nickName:e.detail.value
    })
  },
  // 获取主页信息
  getInformation(uid) {
    var that = this;
    var item = {
      uid: uid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'User/userinfo', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            infoList: res.data
          });
          that.setData({
            region: [res.data.country, res.data.province, res.data.city],
            nickName:res.data.nick,
            country:res.data.country,
            province:res.data.province,
            city:res.data.city,
            sex:res.data.sex
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

  // 修改资料
  changeInfo() {
    var that = this;
    var item = {
      uid: app.globalData.uid,
      nick: that.data.nickName,
      skill: '',
      province: that.data.province,
      city: that.data.city,
      country: that.data.country,
      headimgurl: '',
      sex: that.data.sexnum
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'User/editInfo', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功'
          });
          setTimeout(function(){
            wx.navigateBack({
              detal: 1
            })
          },1500)
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
    var uid = app.globalData.uid
    this.getInformation(uid);
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
// pages/myself/unitCertification /unitCertification .js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInputStatus: false,
    inputValue: '', //点击结果项之后替换到文本框的值
    adapterSource: [], //本地匹配源
    bindSource: [], //绑定到页面的数据，根据用户输入动态变化
    chooseId:''
  },

  submit(){
    var that = this;
    var uid = app.globalData.uid;
    var cid = that.data.chooseId;
    if (cid=='') {
      wx.showToast({
        title: '请填写单位名称',
        icon:"none"
      });
      return false;
    }
    var item = {
      uid: uid,
      company_id:cid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'User/setCompany', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.showToast({
            title: res.msg
          })
          setTimeout(function(){
            wx.navigateBack({delta:1})
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

  bindKeyInput: function (e) {
    var that = this;
    var uid = app.globalData.uid;
    var currentInputStatu = e.currentTarget.dataset.statu;
    var prefix = e.detail.value //用户实时输入值
    var item = {
      uid: app.globalData.uid,
      search: prefix
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'User/getCompany', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            adapterSource: res.data
          });
          var newSource = [] //匹配的结果
          if (prefix != "") {
            this.setData({
              showBtnStatus1: false,
              showBtnStatus2: true
            });
            this.data.adapterSource.forEach(function (e) {
              //console.log(e)
              if (e.name.indexOf(prefix) != -1) { //返回某个指定的字符串值在字符串中首次出现的位置,如果要检索的字符串值没有出现，则该方法返回 -1
                newSource.push(e)
              }
            })
          } else {
            currentInputStatu = "close";
            this.setData({
              isScroll: true,
              showBtnStatus1: true,
              showBtnStatus2: false
            });
          }
          if (newSource.length != 0) {
            this.setData({
              bindSource: newSource
            })
          } else {
            this.setData({
              bindSource: []
            })
            currentInputStatu = "close";
            this.setData({
              isScroll: "{{false}}"
            });
          }
          //关闭 
          if (currentInputStatu == "close") {
            this.setData({
              showInputStatus: false,
              isScroll: true
            });
          }
          // 显示 
          if (currentInputStatu == "open") {
            this.setData({
              showInputStatus: true,
              isScroll: "{{false}}"
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
  //点击选型确定input值
  itemtap: function (e) {
    //console.log(e)
    var currentInputStatu = e.currentTarget.dataset.statu;
    this.setData({
      inputValue: e.currentTarget.dataset.name,
      chooseId: e.target.id,
      bindSource: []
    })
    //关闭 
    if (currentInputStatu == "close") {
      this.setData({
        showInputStatus: false,
        isScroll: true
      });
    }
    // 显示 
    if (currentInputStatu == "open") {
      this.setData({
        showInputStatus: true,
        isScroll: "{{false}}"
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  change(e) { ///自定义方法
    //console.log('change', e.detail.id)
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
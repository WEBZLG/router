// pages/myself/customisedScheme /customisedScheme .js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateStart:'',
    dateEnd:'',
    name:'',
    phone:'',
    people:'',
    startPlace:'',
    endPlace:'',
    remark:'',
    newDate: util.formatTime(new Date())
  },
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  people: function (e) {
    this.setData({
      people: e.detail.value
    })
  },
  startPlace: function (e) {
    this.setData({
      startPlace: e.detail.value
    })
  },
  endPlace: function (e) {
    this.setData({
      endPlace: e.detail.value
    })
  },
  bindDateStart:function(e) {
      this.setData({
        dateStart: e.detail.value
        })
    },
  bindDateEnd: function (e) {
    this.setData({
      dateEnd: e.detail.value
    })
  },
  remark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  // 获取列表
  submit() {
    var that = this;
    var name = this.data.name;
    var phone = this.data.phone;
    var people = this.data.people;
    var startPlace = this.data.startPlace;
    var endPlace = this.data.endPlace;
    var dateStart = this.data.dateStart;
    var dateEnd = this.data.dateEnd;
    var remark = this.data.remark; 
    if(name==''){
      wx.showToast({
        title: '请输入姓名',
        icon: "none"
      });
      return false;
    }else if(phone==''){
      wx.showToast({
        title: '请输入电话号码',
        icon:"none"
      });
      return false;
    } else if (people == '') {
      wx.showToast({
        title: '请输入出行人数',
        icon: "none"
      });
      return false;
    } else if (startPlace == '') {
      wx.showToast({
        title: '请输入出发地',
        icon: "none"
      });
      return false;
    } else if (endPlace == '') {
      wx.showToast({
        title: '请输入目的地',
        icon: "none"
      });
      return false;
    } else if (dateStart == '') {
      wx.showToast({
        title: '请选择出发日期',
        icon: "none"
      });
      return false;
    } else if (dateEnd == '') {
      wx.showToast({
        title: '请选择返回日期',
        icon: "none"
      });
      return false;
    }
    var item = {
      uid: app.globalData.uid,
      contacts: name,
      phone:phone,
      tour_num: people,
      sart_off: startPlace,
      destination: endPlace,
      start_time: dateStart,
      return_time: dateEnd,
      remark: remark
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'travel/travelDiy', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../myRouter/myRouter',
            })
          },1500)
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../myRouter/myRouter',
            })
          }, 1500)
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
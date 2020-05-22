// pages/router/addPeople/addPeople.js

const app = getApp()
var ajax = require("../../../utils/ajax.js")
var city = require("../../../utils/cityArray.js")
var list = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    sexText: '1',
    idcard: '',
    province: '北京市',
    city:'北京市',
    phone: '',
    telphone: '',
    email: '',
    address: '',
    sex: ['男', '女'],
    index: 0,
    multiIndex: [0, 0],
    multiArray: city.multiArray,
    objectMultiArray: city.objectMultiArray
  },
  // 性别
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    });
    if (e.detail.value == 0) {
      this.setData({
        sexText: '1'
      });
    } else {
      this.setData({
        sexText: '2'
      });
    }
  },
  // 国家地区
  bindMultiPickerChange: function(e) {
    console.log(e)
    var that = this;
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      province: that.data.multiArray[0][that.data.multiIndex[0]],
      city: that.data.multiArray[1][that.data.multiIndex[1]]
    })
    console.log(this.data.multiArray[0][this.data.multiIndex[0]], this.data.multiArray[1][this.data.multiIndex[1]])
  },
  bindMultiPickerColumnChange: function(e) {
    console.log(e)
    var that = this;
    switch (e.detail.column) {
      case 0:
        list = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            list.push(that.data.objectMultiArray[i].regname)
          }
        }
        that.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value,
          "multiIndex[1]": 0
        })

    }
  },
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  idcard(e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  phone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  telphone(e) {
    this.setData({
      telphone: e.detail.value
    })
  },
  email(e) {
    this.setData({
      email: e.detail.value
    })
  },
  address(e) {
    this.setData({
      address: e.detail.value
    })
  },
  submit(uid) {
    var that = this;
    var uid = app.globalData.uid;
    var name = this.data.name;
    var sexText = this.data.sexText;
    var idcard = this.data.idcard;
    var province = this.data.province;
    var city = this.data.city;
    var phone = this.data.phone;
    var telphone = this.data.telphone;
    var email = this.data.email;
    var address = this.data.address;
    if(name==''){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      });
      return false;
    }else if(idcard==''){
      wx.showToast({
        title: '请输入身份证号',
        icon: "none"
      });
      return false;
    }
    else if (phone=='') {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      });
      return false;
    }
    var item = {
      uid: uid,
      name: name,
      sex: sexText,
      type:'1',
      card_num: idcard,
      province: province,
      city: city,
      phone: phone,
      tel: telphone,
      email: email,
      address: address
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/addUsedInfo', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '添加成功',
          })
          setTimeout(function(){
            wx.navigateBack({
              delta:1
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
  onLoad: function(options) {
    console.log(city.multiArray)
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
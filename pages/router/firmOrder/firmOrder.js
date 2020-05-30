// pages/router/firmOrder/firmOrder.js
const app = getApp()
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    member: ''
  },
  // 修改信息
  changeInfo() {
    wx.navigateBack({
      delta: 1
    })
  },
  cancel() {
    wx.navigateBack({
      delta: 3
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var item = JSON.parse(options.item)
    this.getData(item);
  },
  // 报名提交
  submit() {
    var that = this;
    wx.navigateTo({
      url: '../paySuccess/paySuccess'
    });
    wx.login({
      success(res) {
        if (res.code) {
          var uid = app.globalData.uid;
          var tid = that.data.dataList.travelInfo.id;
          var term_id = that.data.dataList.currentTerm.id;
          var member = that.data.member;
          var name = that.data.dataList.pay_info.name;
          var phone = that.data.dataList.pay_info.phone;
          var insure = that.data.dataList.travelInfo.is_insure;
          var item = {
            uid: uid,
            tid: tid,
            term_id: term_id,
            members: member,
            action: 'pay',
            name: name,
            phone: phone,
            insure: insure,
            code:res.code
          }
          console.log(item)
          wx.showLoading({
            mask: 'true'
          });
          ajax.wxRequest('POST', 'Travel/signUp', item,
            (res) => {
              wx.hideLoading();
              console.log(res)
              if (res.code == 200) {
                wx.hideLoading();
                var data = JSON.parse(res.data.parameters);
                var oid = res.data.oid;
                console.log(data)
                wx.requestPayment({
                  timeStamp: data.timeStamp,
                  nonceStr: data.nonceStr,
                  package: data.package,
                  signType: data.signType,
                  paySign: data.paySign,
                  success(res) {
                    that.done(oid)
                  },
                  fail(res) {
                    wx.showToast({
                      title: res,
                      icon: "none"
                    })
                  }
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: res.msg,
                  icon: "none"
                });
              }

            },
            (err) => {
              wx.hideLoading();
              wx.showToast({
                title: '数据加载失败' + err,
                icon: "none"
              })
            })
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
        }
      }
    })

  },
  done(oid) {
    var that = this
    var uid = app.globalData.uid;
    var tid = that.data.dataList.travelInfo.id;
    var term_id = that.data.dataList.currentTerm.id;
    var member = this.data.member;
    var name = this.data.dataList.pay_info.name;
    var phone = this.data.dataList.pay_info.phone;
    var insure = that.data.dataList.travelInfo.is_insure;
    var item = {
      uid: uid,
      tid: tid,
      term_id: term_id,
      members: member,
      action: 'done',
      name: name,
      phone: phone,
      insure: insure,
      oid: oid
    }
    console.log(item)
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Travel/signUp', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        // var data = JSON.stringify(res.data);
        app.globalData.successData = res.data;
        if (res.code == 200) {
          wx.navigateTo({
            url: '../paySuccess/paySuccess'
          });
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

  getData(item) {
    var that = this;
    ajax.wxRequest('POST', 'Travel/signUp', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          var member = [];
          for (var i in res.data.members) {
            member = member.concat(res.data.members[i].id)
          }
          that.setData({
            dataList: res.data,
            member: member
          })

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          });
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
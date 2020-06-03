const app = getApp()
var ajax = require("../../../utils/ajax.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    choose: [],
    insure: ''
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
  submit() {
    var that = this;
    var uid = app.globalData.uid;
    wx.login({
      success(res) {
        if (res.code) {

          var pink_id = that.data.dataList.id;
          var member = that.data.choose;
          var name = that.data.dataList.name;
          var phone = that.data.dataList.phone;
          var insure = that.data.dataList.is_insure;
          var item = {
            uid: uid,
            pink_id: pink_id,
            members: member,
            action: 'pay',
            name: name,
            phone: phone,
            insure: insure,
            code: res.code
          }
          //console.log(item)
          wx.showLoading({
            mask: 'true'
          });
          ajax.wxRequest('POST', 'travel/pinkSignUp', item,
            (res) => {
              wx.hideLoading();
              //console.log(res)
              if (res.code == 200) {
                wx.hideLoading();
                var data = JSON.parse(res.data.parameters);
                var oid = res.data.oid;
                wx.requestPayment({
                  timeStamp: data.timeStamp,
                  nonceStr: data.nonceStr,
                  package: data.package,
                  signType: 'MD5',
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

              } else if (res.code == 400) {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
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
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          });
        }
      }
    })
  },

  done(oid) {
    var that = this;
    var uid = app.globalData.uid;
    var sid = this.data.dataList.id;
    var member = this.data.choose;
    var name = this.data.dataList.name;
    var phone = this.data.dataList.phone;
    var insure = this.data.dataList.insure;
    var item = {
      uid: uid,
      pink_id: sid,
      members: member,
      action: 'done',
      name: name,
      phone: phone,
      insure: insure,
      oid: oid,
      sign_rule: 2
    }
    //console.log(item)
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'travel/pinkSignUp', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        // var data = JSON.stringify(res.data);
        // if (res.code == 200) {
        //   wx.navigateTo({
        //     url: '../seckillPaySuccess/seckillPaySuccess?data=' + data
        //   });
        // }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var item = JSON.parse(options.item);
    this.getData(item);
  },
  getData(item) {
    var that = this;
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'travel/pinkSignUp', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          this.setData({
            dataList: res.data
          })
          for (var i in res.data.members) {
            that.setData({
              choose: that.data.choose.concat(res.data.members[i].id)
            })
          }
          //console.log(that.data.choose)
          // var data = JSON.stringify(res.data);
          // wx.navigateTo({
          //   url: '../groupFirmOrder/groupFirmOrder?data=' + data
          // });
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
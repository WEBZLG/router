const app = getApp()
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updata: '',
    startTime: '',
    showModal: false,
    choosePerson: [],
    chooseList: [],
    userPhone: '',
    userName: '',
    pinkid: '',
    totalPrice: '',
    unitPrice: '',
    array: ['费用包含保险', '自行购买保险'],
    index: 0,
    insure: ''
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      insure: e.detail.value
    })
  },
  userPhone(e) {
    var phone = e.detail.value;
    this.setData({
      userPhone: phone
    })
  },

  userName(e) {
    var name = e.detail.value;
    this.setData({
      userName: name
    })
  },

  close() {
    this.setData({
      showModal: false
    })
  },

  preventTouchMove: function () {

  },
  open() {
    this.setData({
      showModal: true
    })
    //console.log(this.data.showModal)
  },
  chooseTime(e) {
    var tid = e.currentTarget.dataset.tid
    wx.navigateTo({
      url: '../../router/datepicker/datepicker?tid=' + tid,
    })
  },
  choosePeople() {
    wx.navigateTo({
      url: '../../router/travelPeople/travelPeople',
    })
  },
  submit() {
    var that = this;
    var uid = app.globalData.uid;
    var pink_id = this.data.pinkid;
    var member = this.data.choosePerson.join(',');
    var name = this.data.userName;
    var phone = this.data.userPhone;
    var insure = this.data.insure;
    if (member == '') {
      wx.showToast({
        title: '请选择出行人',
        icon: "none"
      });
      return false;
    } else if (name == '') {
      wx.showToast({
        title: '请填写联系人姓名',
        icon: "none"
      });
      return false;
    } else if (phone == '') {
      wx.showToast({
        title: '请填写联系人电话',
        icon: "none"
      });
      return false;
    } 
    var item = {
      uid: uid,
      pink_id: pink_id,
      members: member,
      action: 'affirm',
      name: name,
      phone: phone,
      insure: insure,
      sign_rule:'2'
    }
    //console.log(item)
    var item = JSON.stringify(item);
    wx.navigateTo({
      url: '../groupFirmOrder/groupFirmOrder?item=' + item
    });
    // wx.showLoading({
    //   mask: 'true'
    // });
    // ajax.wxRequest('POST', 'travel/pinkSignUp', item,
    //   (res) => {
    //     wx.hideLoading();
    //     //console.log(res)
    //     if (res.code == 200) {
    //       wx.hideLoading();
    //       var data = JSON.stringify(res.data);
    //       wx.navigateTo({
    //         url: '../groupFirmOrder/groupFirmOrder?data=' + data
    //       });
    //     } else {
    //       wx.hideLoading();
    //       wx.showToast({
    //         title: res.msg,
    //         icon: "none"
    //       });
    //     }

    //   },
    //   (err) => {
    //     wx.hideLoading();
    //     wx.showToast({
    //       title: '数据加载失败' + err,
    //       icon: "none"
    //     })
    //   })
  },

  getData(uid, pink_id, action) {
    var that = this;
    var item = {
      uid: uid,
      pink_id: pink_id,
      members: '',
      action: action,
      name: '',
      phone: '',
      insure: ''
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'travel/pinkSignUp', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            updata: res.data,
            insure: res.data.is_insure,
            startTime: res.data.start_time,
            unitPrice: res.data.price
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
  peopleList(uid) {
    var that = this;
    var choosePeople = that.data.choosePerson;
    var item = {
      uid: uid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/usedInformation', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            chooseList: []
          })
          for (var i = 0; i < res.data.length; i++) {
            for (var j = 0; j < choosePeople.length; j++) {
              if (res.data[i].id == choosePeople[j]) {
                this.setData({
                  chooseList: that.data.chooseList.concat(res.data[i])
                })
              }
            }
          }
          var choose = that.data.chooseList;
          var man = [], child = [];
          for (var k in choose) {
            if (choose[k].type == '成人') {
              man = man.concat(choose[k])
            } else {
              child = child.concat(choose[k])
            }
          }
          that.setData({
            // totalPrice: that.data.updata.currentTerm.man_price * man.length + that.data.updata.currentTerm.children_price * child.length
            totalPrice:choose.length*that.data.unitPrice
          })
          //console.log(that.data.chooseList)
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
    var id = options.id;
    this.setData({
      pinkid: id
    })
    var uid = app.globalData.uid;
    this.getData(uid, id, 'sign')
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
    //console.log(this.data.choosePerson)
    this.peopleList(uid)
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
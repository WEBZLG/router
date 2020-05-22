// pages/router/fillOrder/fillOrder.js
const app = getApp()
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{},
    updata:[],
    startTime:'',
    showModal: false,
    choosePerson:[],
    chooseList:[],
    totalPrice:'',
    term_id:'',
    tid:'',
    userPhone:'',
    userName:'',
    array:['费用包含保险','自行购买保险'],
    index:0,
    insure:''
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      insure: e.detail.value
    })
  },
  //电话
  userPhone(e) {
    var phone = e.detail.value;
    this.setData({
      userPhone: phone
    })
  },
// 姓名
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
  open(){
    this.setData({
      showModal: true
    })
    console.log(this.data.showModal)
  },

  // 选择日期
  chooseTime(){
    var tid = this.data.tid;

    wx.navigateTo({
      url: '../datepicker/datepicker?tid='+tid,
    })
  },
  // 选择出行人
  choosePeople(){
    wx.navigateTo({
      url: '../travelPeople/travelPeople',
    })
  },
  // 出行人列表
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
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            chooseList:[]
          })
          for (var i = 0; i < res.data.length; i++) {
            for (var j = 0; j < choosePeople.length; j++) {
              if (res.data[i].id == choosePeople[j]) {
                that.setData({
                  chooseList: that.data.chooseList.concat(res.data[i])
                })
              }
            }
          }
          var choose = that.data.chooseList;
          var man=[],child=[];
          for(var k in choose){
            if(choose[k].type=='成人'){
              man = man.concat(choose[k])
            }else{
              child = child.concat(choose[k])
            }
          }
          that.setData({
            totalPrice: that.data.updata.currentTerm.man_price * man.length + that.data.updata.currentTerm.children_price * child.length
          })


          console.log(that.data.choosePerson)
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
// 获取数据
getdata(){
  var that = this;
  var uid = app.globalData.uid;
  var tid = that.data.tid;
  var term_id = this.data.term_id;
  var item = {
    uid: uid,
    tid: tid,
    term_id: term_id,
    members: '',
    action: 'sign',
    name: '',
    phone: '',
    insure: ''
  }
  console.log(item)
  wx.showLoading({
    mask: 'true'
  });
  ajax.wxRequest('POST', 'Travel/signUp', item,
    (res) => {
      console.log(res)
      if (res.code == 200) {
        wx.hideLoading();
        that.setData({
          dataList: res.data,
          insure: res.data.travelInfo.is_insure
        })
      } 
      // else if(res.code==303){
      //   wx.showModal({
      //     title: '微信授权',
      //     content: '报名需要微信授权',
      //     cancelText: "取消",
      //     confirmText: "确定",
      //     success: function (res) {
      //       if (res.confirm) {
      //         wx.login({
      //           success(res) {
      //             if (res.code) {
      //               that.bindWx(uid,res.code)
      //             } else {
      //               console.log('授权失败！' + res.errMsg)
      //             }
      //           }
      //         })
      //       } else {
      //         wx.navigateBack({
      //           detal:1
      //         })
      //       }
      //     }
      //   });
      // }
      else{
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
  // 报名提交
  submit() {
    var that = this;
    var uid = app.globalData.uid;
    var tid = that.data.tid;
    var term_id = this.data.term_id;
    var member = this.data.choosePerson.join(',');
    var name = this.data.userName;
    var phone = this.data.userPhone;
    var insure = that.data.insure;
    console.log(insure)
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
      tid:tid,
      term_id: term_id,
      members: member,
      action: 'affirm',
      name: name,
      phone: phone,
      insure: insure
    }
    wx.showLoading({
      mask: 'true'
    });
    var item = JSON.stringify(item);
    wx.navigateTo({
      url: '../firmOrder/firmOrder?item=' + item 
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var travelInfo = JSON.parse(options.travelInfo)
    this.setData({
      updata: travelInfo,
      tid: travelInfo.id,
      term_id: travelInfo.currentTerm.id
    });
    this.getdata()
    console.log(travelInfo)
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
    console.log(this.data.choosePerson)
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
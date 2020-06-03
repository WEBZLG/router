// pages/home/traderApply/traderApply.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    travel: '',
    address: '',
    idcard:'',
    images1: '',
    images2: '',
    images3: '../../../images/cardzbg.png',
    images4: '../../../images/cardfbg.png',
    images5: '../../../images/cardbg.png',
    upimages1: '',
    upimages2: '',
    upimages3:'',
    upimages4:'',
    upimages5:'',
    isShow1: false,
    isShow2: false,
    isShow3: false,
    isShow4: false,
    isShow5: false,
  },
  // 删除图片
  deleteImg(e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    if (tid == 0) {
      that.setData({
        isShow1: false,
        images1:'',
        upimages1:''
      })
    } else if (tid == 1) {
      that.setData({
        isShow2: false,
        images2:'',
        upimages2:''
      })
    } else if (tid == 2) {
      that.setData({
        isShow3: false,
        images3: '../../../images/cardzbg.png',
        upimages3:''
      })
    } else if (tid == 3) {
      that.setData({
        isShow4: false,
        images4: '../../../images/cardfbg.png',
        upimages4:''
      })
    } else if (tid == 4) {
      that.setData({
        isShow5: false,
        images5: '../../../images/cardbg.png',
        upimages5:''
      })
    }
  },

  // 选择图片
  chooseImg: function(e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        //console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        if (tid == 0) {
          that.setData({
            images1: tempFilePaths,
            isShow1: true,
            upimages1: tempFilePaths
          })
          //console.log(that.data.isShow1)
        } else if (tid == 1) {
          that.setData({
            images2: tempFilePaths,
            isShow2: true,
            upimages2: tempFilePaths
          })
        } else if (tid == 2) {
          that.setData({
            images3: tempFilePaths,
            upimages3: tempFilePaths,
            isShow3: true
          })
        } else if (tid == 3) {
          that.setData({
            images4: tempFilePaths,
            upimages4: tempFilePaths,
            isShow4: true
          })
        } else if (tid == 4) {
          that.setData({
            images5: tempFilePaths,
            upimages5: tempFilePaths,
            isShow5: true
          });
        }
      }
    })

  },

  realName(e) {
    var name = e.detail.value;
    this.setData({
      name: name
    })
  },
  phoneNum(e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  travelAgency(e) {
    var travel = e.detail.value;
    this.setData({
      travel: travel
    })
  },
  address(e) {
    var address = e.detail.value;
    this.setData({
      address: address
    })
  },
  // idcard(e) {
  //   var idcard = e.detail.value;
  //   this.setData({
  //     idcard: idcard
  //   })
  // },
  submit(){
    var that = this;
    var uid = app.globalData.uid;
    var name = that.data.name;
    var phone = that.data.phone;
    var company = that.data.travel;
    var address = that.data.address;
    var idcard = that.data.idcard;
    var images1 = that.data.upimages1;
    var images2 = that.data.upimages2;
    var images3 = that.data.upimages3;
    var images4 = that.data.upimages4;
    var images5 = that.data.upimages5;
    if (name == '' || phone == '' || company == '' || address == '') {
      wx.showToast({
        title: '请填写完整数据',
        icon: "none"
      });
      return false;
    } else if (images1 == '' || images2 == '' || images3 == '' || images4 == '' || images5 == '') {
      wx.showToast({
        title: '请上传所需证件',
        icon: "none"
      });
      return false;
    }
    wx.showLoading({
      title:"上传图片中",
      mask: 'true',
      icon:''
    })
    ajax.uploadimg(that.data.images1, function (res) {
      that.setData({
        // images1: ajax.resPath + res.data.path,
        upimages1:res.data.path
      });
      //console.log('成功1')
      ajax.uploadimg(that.data.images2, function (res) {
        that.setData({
          // images2: ajax.resPath + res.data.path,
          upimages2:res.data.path
        });
        //console.log('成功2')
        ajax.uploadimg(that.data.images3, function (res) {
          that.setData({
            // images3: ajax.resPath + res.data.path,
            upimages3:res.data.path
          });
          //console.log('成功3')
          ajax.uploadimg(that.data.images4, function (res) {
            that.setData({
              // images4: ajax.resPath + res.data.path,
              upimages4:res.data.path
            });
            //console.log('成功4')
            ajax.uploadimg(that.data.images5, function (res) {
              that.setData({
                // images5: ajax.resPath + res.data.path,
                upimages5:res.data.path
              });
              //console.log('成功5');
              // wx.hideLoading();
              var item = {
                'uid': uid,
                'name': name,
                'phone': phone,
                'company': company,
                'address': address,
                'pic_business': that.data.upimages1,
                'pic_business_charter': that.data.upimages2,
                'pic_card_font': that.data.upimages3,
                'pic_card_back': that.data.upimages4,
                'pic_legal_card': that.data.upimages5
              }
              wx.showLoading({
                mask: 'ture',
                title: "提交中"
              });
              ajax.wxRequest('POST', 'User/apply', item,
                (res) => {
                  wx.hideLoading();
                  //console.log(res)
                  if (res.code == 200) {
                    wx.showToast({
                      title: res.msg,
                      icon: "none"
                    })
                    var phone = that.data.phone
                    wx.redirectTo({
                      url: '../traderApplyCheck/traderApplyCheck?phone='+phone,
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
            })
          })
        })
      })
    })

  },
  getData(uid, phone) {
    var that = this;
    var item = {
      'uid': uid,
      'phone': phone
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'User/apply_status', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 400) {
          wx.hideLoading();
          var dataList = res.data;
          that.setData({
            name: dataList.name,
            phone: dataList.phone,
            travel: dataList.company,
            address: dataList.address,
            idcard: dataList.card_no,
            images1: dataList.pic_business,
            images2: dataList.pic_business_charter,
            images3: dataList.pic_card_font,
            images4: dataList.pic_card_back,
            images5: dataList.pic_legal_card,
            isShow1: true,
            isShow2: true,
            isShow3: true,
            isShow4: true,
            isShow5: true,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //console.log(options.phone)
    var uid = app.globalData.uid;
    if (options.phone){
      that.getData(uid,options.phone)
    }

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
// pages/myself/nameApprove/nameApprove.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname: '',
    idcard: '',
    imgz: '',
    imgf: '',
    upz: '',
    upf: ''
  },
  realname: function(e) {
    this.setData({
      realname: e.detail.value
    })
  },
  idcard: function(e) {
    this.setData({
      idcard: e.detail.value
    })
  },

  uploadimg: function(imgpath, callback) {
    var that = this;
    wx.uploadFile({
      url: ajax.serverPath + 'User/uploadImg', //此处换上你的接口地址
      filePath: imgpath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      formData: {
        'uid': app.globalData.uid
      },
      success: function(res) {
        var res = JSON.parse(res.data)
        console.log(res)
        if (res.code == 200) {
          callback(res);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }

      },
      fail: function(res) {
        console.log(res);

      },
    })
  },
  chooseImg: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        if (id == 0) {
          that.setData({
            imgz: tempFilePaths
          })
        } else if (id == 1) {
          that.setData({
            imgf: tempFilePaths
          })
        }
      }
    })
  },

  submit: function() {
    var that = this;
    var uid = app.globalData.uid;
    var name = this.data.realname;
    var num = this.data.idcard;
    var imgz = this.data.imgz[0];
    var imgf = this.data.imgf[0];
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (name == '') {
      wx.showToast({
        title: '请填写真实姓名',
        icon: "none"
      });
      return false;
    } else if (num == '') {
      wx.showToast({
        title: '请填写身份证号',
        icon: "none"
      });
      return false;
    } else if (reg.test(num) === false) {
      wx.showToast({
        title: '请输入正确身份证号',
        icon: "none"
      });
      return false;
    } else if (imgz == '') {
      wx.showToast({
        title: '请上传身份证正面照片',
        icon: "none"
      });
      return false;
    } else if (imgf == '') {
      wx.showToast({
        title: '请上传身份证反面照片',
        icon: "none"
      });
      return false;
    }
    wx.showLoading({
      mask: 'true'
    });
    this.uploadimg(imgz, function(res) {
      that.setData({
        imgz: ajax.resPath + res.data.path,
        upz: res.data.path
      })

      that.uploadimg(imgf, function(res) {
        that.setData({
          imgf: ajax.resPath + res.data.path,
          upf: res.data.path
        })
        var item = {
          uid: uid,
          card_font: that.data.upz,
          card_back: that.data.upf,
          card_no: num,
          name: name
        }
        ajax.wxRequest('POST', 'User/realName', item,
          (res) => {
            wx.hideLoading();
            console.log(res)
            if (res.code == 200) {
              wx.navigateTo({
                url: '../../waitApprove/waitApprove',
              })
            } else {
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
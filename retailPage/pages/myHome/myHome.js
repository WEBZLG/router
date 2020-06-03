// pages/myself/myhome/myhome.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    infoList: '',
    imgPath: ajax.resPath,
    homeBgImg: '',
    headImgUrl: '',
    name:''
  },

  myInfo: function () {
    wx.navigateTo({
      url: '../myInfo/myInfo',
    })
  },

  chooseImg: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    var title, content
    if (id == 0) {
      title = '修改背景';
      content = '确定修改背景图片？'
    } else if (id == 1) {
      title = '修改头像';
      content = '确定修改头像？'
    }
    wx.showModal({
      title: title,
      content: content,
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              //console.log(res)
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              if (id == 0) {
                ajax.uploadimg(tempFilePaths[0], function (res) {
                  that.saveBg(that.data.uid, res.data.path);
                  that.setData({
                    homeBgImg: ajax.resPath + res.data.path
                  })
                })
              } else if (id == 1) {
                ajax.uploadimg(tempFilePaths[0], function (res) {
                  //console.log(res)
                  that.saveHeadimg(that.data.uid, res.data.path);
                  that.setData({
                    headImgUrl: ajax.resPath + res.data.path
                  })
                })
              }
            }
          })
        }
      }
    });
  },
  // 保存touxiang
  saveHeadimg(uid, path) {
    var that = this;
    var item = {
      merchid: uid,
      path: path
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Merchant/saveLogo', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功'
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
  // 保存背景
  saveBg(uid, path) {
    var that = this;
    var item = {
      merchid: uid,
      path: path
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Merchant/saveBackgroud', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功'
          })
          setTimeout(function(){
            that.onShow();
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
  // 获取主页信息
  getInformation(uid) {
    var that = this;
    var item = {
      merchid: uid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'Merchant/myHomePage', item,
      (res) => {
        wx.hideLoading({ mask: 'true' });
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            infoList: res.data,
            headImgUrl: res.data.userInfo.pic_logo
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: app.globalData.uid,
      name:options.name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log(app.globalData.uid)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var uid = app.globalData.uid
    this.getInformation(uid);
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
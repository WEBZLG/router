// pages/router/paySuccess/paySuccess.js
const app = getApp()
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{},
    showModal: false,
    modelShow: true,
    canvasShow: true,
    newbackpic: "",
    newpicstr: "",
    codeUrl: "",
  },
  close() {
    this.setData({
      showModal: false
    })
  },

  preventTouchMove: function () {

  },
  open() {
    var that = this;
    ajax.checkLogin('您未登录无法分享', function () {
      that.setData({
        showModal: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = app.globalData.successData;
    this.setData({
      dataList:data
    })
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
  onShareAppMessage: function (ops) {
    var that = this;
    var tid = this.data.tid;
    this.close();
    // if(ops.from==='button'){}
    return {
      title: that.data.travelInfo.title,
      path: '/pages/router/routerDetails/routerDetails?tid=' + tid,
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '转发成功！',
        })
        that.cancel()
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: "none"
        })
      }
    }
  },
  // 生成海报
  getImage: function (url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: function (res) {
          resolve(res)
        },
        fail: function () {
          reject("")
        }
      })
    })
  },
  getImageAll: function (image_src) {
    let that = this;
    var all = [];
    image_src.map(function (item) {
      all.push(that.getImage(item))
    })
    return Promise.all(all)
  },
  //创建
  sharePyq: function (e) {
    wx.showLoading()
    var that = this;
    that.close();
    var item = {
      'uid': app.globalData.uid,
      'tid': e.currentTarget.dataset.id,
      'order_type': 0
    }
    var title = that.data.travelInfo.title.substring(0, 14) + '...';
    var price = '跟团价：' + that.data.currentTerm.man_price;
    wx.showLoading();
    ajax.wxRequest('POST', 'Travel/getWxacode', item,
      (res) => {
        console.log(res)
        var url = res.data.acode_url;
        // var qrbg = res.data.qrcode_bg;
        //获取网络图片本地路径
        wx.getImageInfo({
          src: that.data.imgUrls[0].pic,
          success: function (res) {
            that.setData({
              newbackpic: res.path,
              codeUrl: url
            });
            wx.getImageInfo({
              src: url,
              success: function (res) {
                that.setData({
                  newpicstr: res.path
                })
                let bg = that.data.newbackpic;
                let qr = that.data.newpicstr;
                that.getImageAll([bg, qr]).then((res) => {
                  console.log(res)
                  const ctx = wx.createCanvasContext('shareCanvas')
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, 0, 315, 500)
                  // 底图
                  ctx.drawImage(res[0].path, 0, 0, 315, 330);
                  // 文字
                  ctx.setTextAlign('center') // 文字居中
                  ctx.setFillStyle('#333333') // 文字颜色
                  ctx.setFontSize(16) // 文字字号
                  ctx.fillText(title, 147, 350)
                  ctx.setFillStyle('#ff0000') // 文字颜色
                  ctx.fillText(price, 147, 370)
                  // 小程序码
                  ctx.drawImage(res[1].path, 107, 380, 80, 80)
                  ctx.stroke()
                  ctx.draw()
                  wx.hideLoading()
                  that.setData({
                    canvasShow: false
                  })
                })
              },
              fail: function (res) { }
            });
          },
          fail: function (res) { }
        });
        that.setData({

        })

      },
      (err) => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败' + err,
          icon: "none"
        })
      })

  },
  //保存
  save: function () {
    var that = this;
    wx.canvasToTempFilePath({ //canvas 生成图片 生成临时路径
      canvasId: 'shareCanvas',
      success: function (res) {
        //console.log(res)
        wx.saveImageToPhotosAlbum({ //下载图片
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: "图片已保存到相册",
              icon: "success",
            });
            setTimeout(function () {
              that.setData({
                canvasShow: true
              })

              // var item = {
              //   'user_id': app.globalData.userId,
              //   'path': that.data.codeUrl
              // }
              // ajax.wxRequest('POST', 'share/un_qrcode', item,
              //   (res) => { },
              //   (err) => { })
            }, 2000)
          },
          fail(err) {
            wx.showToast({
              title: '请打开相册储存权限',
              icon: "none"
            })
          }
        })
      }
    })
  }
})
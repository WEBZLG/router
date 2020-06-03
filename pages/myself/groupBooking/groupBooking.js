// pages/myself/groupBooking/groupBooking.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabA: 0,
    currentTabB: 0,
    navScrollLeft: 0,
    pixelRatio: '',
    windowHeight: '',
    windowWidth: '',
    dataList:{},
    tabShow: 0,
    type1: 1,
    type2:2,
    status1: 0,
    status2:0,
    showModal: false,
    modelShow: true,
    canvasShow: true,
    newbackpic: "",
    newpicstr: "",
    codeUrl: "",
    stitle: '',
    spic: '',
    sid: '',
  },
  close() {
    this.setData({
      showModal: false
    })
  },

  preventTouchMove: function () {

  },
  open(e) {
    var stitle = e.currentTarget.dataset.title;
    var spic = e.currentTarget.dataset.pic;
    var sid = e.currentTarget.dataset.id;
    //console.log(stitle, spic, sid)
    this.setData({
      showModal: true,
      stitle: stitle,
      spic: spic,
      sid: sid,
    })
  },
// 报名详情
  signUpDetails(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../bookingDetails/bookingDetails?id='+id,
    })
  },
// 订单详情
  orderDetails(e){
    var tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id='+tid,
    })
  },
  // 切换
  tabChange(e) {
    var that = this;
    var tab = e.currentTarget.dataset.tab;
    //console.log(tab)
    this.setData({
      tabShow: tab,
    });
    var uid = app.globalData.uid;
    if(tab==0){
      var status = that.data.status1
      that.getData(uid, 1, status)
    }else{
      var status = that.data.status2
      that.getData(uid, 2, status)
    }
  },
  switchNavA(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTabA == cur) {
      return false;
    } else {
      this.setData({
        currentTabA: cur
      })
    }
  },
  switchTabA(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTabA: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },
  switchNavB(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTabB == cur) {
      return false;
    } else {
      this.setData({
        currentTabB: cur
      })
    }
  },
  switchTabB(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTabB: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },
  //点击切换
  clickTabA: function (e) {
    // var uid = 9;
    var uid = app.globalData.uid;
    var idx = e.currentTarget.dataset.current;
    //console.log(idx)
    var that = this;
    if (idx == 0) {
      that.getData(uid, 1, 0)
      that.setData({
        status1: 0
      })
    } else if (idx == 1) {
      that.getData(uid, 1, 1)
      that.setData({
        status1: 1
      })
    } else if (idx == 2) {
      that.getData(uid, 1, 2)
      that.setData({
        status1: 2
      })
    } else if (idx == 3) {
      that.getData(uid, 1, 3)
      that.setData({
        status1: 3
      })
    }
    if (this.data.currentTabA === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTabA: e.target.dataset.current,
      })
    }
  },
  //点击切换
  clickTabB: function (e) {
    // var uid = 9;
    var uid = app.globalData.uid;
    var idx = e.currentTarget.dataset.current;
    //console.log(idx)
    var that = this;
    if (idx == 0) {
      that.getData(uid, 2, 0)
      that.setData({
        status2: 0
      })
    } else if (idx == 1) {
      that.getData(uid, 2, 1)
      that.setData({
        status2: 0
      })
    } else if (idx == 2) {
      that.getData(uid, 2, 2)
      that.setData({
        status2: 2
      })
    } else if (idx == 3) {
      that.getData(uid, 2, 3)
      that.setData({
        status2: 3
      })
    }
    if (this.data.currentTabB === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTabB: e.target.dataset.current,
      })
    }
  },
  // 获取列表
  getData(uid,type,status) {
    var that = this;
    var item = {
      uid: uid,
      type:type,
      status:status
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/pinkList', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList: res.data
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
    var uid = app.globalData.uid;
    // var uid = 9;
    this.getData(uid,1,0);
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
    var tid = this.data.sid;
    this.close();
    // if(ops.from==='button'){}
    return {
      title: that.data.stitle,
      path: '/pages/router/routerDetails/routerDetails?tid=' + tid,
      success: function (res) {
        //console.log(res)
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
      'tid': that.data.sid,
      'order_type': 1
    }
    var title = that.data.stitle;
    wx.showLoading();
    ajax.wxRequest('POST', 'Travel/getWxacode', item,
      (res) => {
        //console.log(res)
        var url = res.data.acode_url;
        // var qrbg = res.data.qrcode_bg;
        //获取网络图片本地路径
        wx.getImageInfo({
          src: that.data.spic,
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
                  //console.log(res)
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
        //console.log(err)
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
        ////console.log(res)
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
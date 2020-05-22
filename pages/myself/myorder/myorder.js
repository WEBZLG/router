// pages/myself/groupBooking/groupBooking.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    navScrollLeft: 0,
    pixelRatio: '',
    windowHeight: '',
    windowWidth: '',
    dataList: {}, //数据
    status: '',
    showModal: false,
    modelShow: true,
    canvasShow: true,
    newbackpic: "",
    newpicstr: "",
    codeUrl: "",
    stitle: '',
    spic: '',
    sid: '',
    stype: ''
  },
  // 消费记录
  expenseList() {
    wx.navigateTo({
      url: '../expenseList/expenseList',
    })
  },
  // 导览
  guideInfo(e) {
    var tid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '../guideInfo/guideInfo?oid=' + tid,
    })
  },

  // 订单详情
  orderDetails(e) {
    var id = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id=' + id,
    })
  },
  close() {
    this.setData({
      showModal: false
    })
  },

  preventTouchMove: function() {

  },
  open(e) {
    var stitle = e.currentTarget.dataset.title;
    var spic = e.currentTarget.dataset.pic;
    var sid = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    console.log(stitle, spic, sid)
    this.setData({
      showModal: true,
      stitle: stitle,
      spic: spic,
      sid: sid,
      stype: type
    })
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    console.log(event)
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
    this.getData(cur + 1, '')
  },
  //点击切换
  clickTab: function(e) {
    var uid = app.globalData.uid;
    var idx = e.currentTarget.dataset.current;
    console.log(idx)
    var that = this;
    if (idx == 0) {
      that.getData(uid, '')
      that.setData({
        status: ''
      })
    } else if (idx == 1) {
      that.getData(uid, 0)
      that.setData({
        status: 0
      })
    } else if (idx == 2) {
      that.getData(uid, 2)
      that.setData({
        status: 2
      })
    } else if (idx == 3) {
      that.getData(uid, 4)
      that.setData({
        status: 4
      })
    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  // 获取订单列表
  getData(uid, status) {
    var that = this;
    var item = {
      uid: uid,
      status: status
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/order', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
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
  // 签到
  signUp(e) {
    var that = this;
    var uid = app.globalData.uid;
    var oid = e.currentTarget.dataset.oid;
    var item = {
      uid: uid,
      oid: oid,
      sign_up: '1'
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/orderCheckIn', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
          })
          setTimeout(function() {
            var uid = app.globalData.uid;
            var status = that.data.status;
            that.getData(uid, status)
          }, 2000)

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
  // 申请退款
  refund(e) {
    var that = this;
    wx.showModal({
      title: '申请退款',
      content: '确定申请退款？',
      cancelText: "取消",
      confirmText: "确定",
      success: function(res) {
        if (res.confirm) {
          var uid = app.globalData.uid;
          var oid = e.currentTarget.dataset.oid;
          var item = {
            uid: uid,
            oid: oid,
          }
          wx.showLoading({
            mask: 'true'
          });
          ajax.wxRequest('POST', 'User/orderRefund', item,
            (res) => {
              wx.hideLoading();
              console.log(res)
              if (res.code == 200) {
                wx.hideLoading();
                var uid = app.globalData.uid;
                var status = that.data.status;
                that.getData(uid, status)
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
        } else {

        }
      }
    });

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
    var uid = app.globalData.uid;
    this.getData(uid, '');
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
    var uid = app.globalData.uid;
    var status = this.data.status;
    this.getData(uid, status)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    var that = this;
    var tid = this.data.sid;
    this.close();
    // if(ops.from==='button'){}
    return {
      title: that.data.stitle,
      path: '/pages/router/routerDetails/routerDetails?tid=' + tid,
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: '转发成功！',
        })
        that.cancel()
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: "none"
        })
      }
    }
  },
  // 生成海报
  getImage: function(url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: function(res) {
          resolve(res)
        },
        fail: function() {
          reject("")
        }
      })
    })
  },
  getImageAll: function(image_src) {
    let that = this;
    var all = [];
    image_src.map(function(item) {
      all.push(that.getImage(item))
    })
    return Promise.all(all)
  },
  //创建
  sharePyq: function(e) {
    wx.showLoading()
    var that = this;
    that.close();
    var item = {
      'uid': app.globalData.uid,
      'tid': that.data.sid,
      'order_type': that.data.stype
    }
    var title = that.data.stitle;
    wx.showLoading();
    ajax.wxRequest('POST', 'Travel/getWxacode', item,
      (res) => {
        console.log(res)
        var url = res.data.acode_url;
        // var qrbg = res.data.qrcode_bg;
        //获取网络图片本地路径
        wx.getImageInfo({
          src: that.data.spic,
          success: function(res) {
            that.setData({
              newbackpic: res.path,
              codeUrl: url
            });
            wx.getImageInfo({
              src: url,
              success: function(res) {
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
              fail: function(res) {}
            });
          },
          fail: function(res) {}
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
  save: function() {
    var that = this;
    wx.canvasToTempFilePath({ //canvas 生成图片 生成临时路径
      canvasId: 'shareCanvas',
      success: function(res) {
        //console.log(res)
        wx.saveImageToPhotosAlbum({ //下载图片
          filePath: res.tempFilePath,
          success: function() {
            wx.showToast({
              title: "图片已保存到相册",
              icon: "success",
            });
            setTimeout(function() {
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
// pages/router/routerDetials/routerDetails.js
const app = getApp()
var ajax = require("../../../utils/ajax.js");
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTerm: '',
    travelInfo: '',
    imgUrls: [],
    time: '请选择',
    currentTab: 0,
    startTime: '',
    price: '',
    place: '',
    tid: '',
    showModal: false,
    modelShow: true,
    canvasShow: true,
    newbackpic: "",
    newpicstr: "",
    codeUrl: "",
    fixedNav: true,
    talk: '',
    aid: '',
    type: '',
    winHeight: ''
  },


  close() {
    this.setData({
      showModal: false
    })
  },

  preventTouchMove: function() {

  },
  open() {
    var that = this;
    ajax.checkLogin('您未登录无法分享', function() {
      that.setData({
        showModal: true
      })
    })
  },
  // 报名
  fillOrder(e) {
    var that = this;
    ajax.checkLogin('您未登录无法报名', function() {
      var travelInfo = {
        category: that.data.travelInfo.category,
        company: that.data.travelInfo.company,
        title: that.data.travelInfo.title,
        id: that.data.travelInfo.id,
        imgUrls: that.data.imgUrls,
        currentTerm: that.data.currentTerm,
        statTime: that.data.startTime
      }
      travelInfo = JSON.stringify(travelInfo)
      //console.log(travelInfo);
      if (that.data.startTime == '') {
        wx.showToast({
          title: '请选择出发时间',
          icon: "none"
        })
      } else {
        wx.navigateTo({
          url: '../fillOrder/fillOrder?travelInfo=' + travelInfo
        })
      }
    })

  },
  companyHome(e) {
    var aid = this.data.talk.aid;
    wx.navigateTo({
      url: '../../home/travelHome/travelHome?aid=' + aid,
    })
  },
  chooseTime(e) {
    var tid = this.data.tid;
    wx.navigateTo({
      url: '../datepicker/datepicker?tid=' + tid,
    })
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  getData(tid) {
    var that = this;
    var item = {
      'tid': tid
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'Index/travelDetail', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            currentTerm: res.data.currentTerm,
            imgUrls: res.data.pics,
            travelInfo: res.data.travelInfo,
            talk: res.data.talk,
            aid: res.data.talk.aid,
            type: res.data.talk.type
          });
          WxParse.wxParse('trip', 'html', res.data.travelInfo.trip, that, 5);
          WxParse.wxParse('content', 'html', res.data.travelInfo.content, that, 5);
          WxParse.wxParse('outlay', 'html', res.data.travelInfo.outlay, that, 5);
          WxParse.wxParse('tour_fee', 'html', res.data.travelInfo.tour_fee, that, 5);
          WxParse.wxParse('sign_notes', 'html', res.data.travelInfo.sign_notes, that, 5);
          WxParse.wxParse('equipment_notes', 'html', res.data.travelInfo.equipment_notes, that, 5);
          wx.setNavigationBarTitle({
            title: that.data.travelInfo.title
          })

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
          if (res.msg == '没有行程') {
            setTimeout(function() {
              wx.navigateBack({
                detal: 1
              })
            }, 1500)
          }
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
  // 创建对话
  creatDialog(e) {
    ajax.checkLogin('您未登录无法咨询', function() {
      var uid = app.globalData.uid;
      var aid = e.currentTarget.dataset.aid;
      var type = e.currentTarget.dataset.type;
      var that = this;
      var item = {
        uid: uid,
        aid: aid,
        type: type
      }
      wx.showLoading({
        mask: 'true'
      });
      ajax.wxRequest('POST', 'Chat/createGroup', item,
        (res) => {
          wx.hideLoading();
          //console.log(res)
          if (res.code == 200) {
            wx.hideLoading();
            var gid = res.data.group_id
            wx.navigateTo({
              url: '../../consult/consultDialog/consultDialog?id=' + gid + '&tid=' + aid + '&type=' + type,
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
  },
  scroll(e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
    let query = wx.createSelectorQuery()
    query.select('.nav').boundingClientRect((rect) => {
      let top = rect.top
      if (top <= 0) { //临界值，根据自己的需求来调整
        this.setData({
          fixedNav: false //是否固定导航栏
        })
      } else {
        this.setData({
          fixedNav: true
        })
      }
    }).exec()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var tid = options.tid;
    var scene = decodeURIComponent(options.scene) //参数二维码传递过来的参数
    // var senceUid = scene.split("&")[0];
    // var senceRid = scene.split("&")[1];
    this.setData({
      tid: tid,
      winHeight: wx.getSystemInfoSync().windowHeight,
    })
    //console.log(options)
    this.getData(tid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  onShareAppMessage: function(ops) {
    var that = this;
    var tid = this.data.tid;
    this.close();
    // if(ops.from==='button'){}
    return {
      title: that.data.travelInfo.title,
      path: '/pages/router/routerDetails/routerDetails?tid=' + tid,
      success: function(res) {
        //console.log(res)
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
      'tid': e.currentTarget.dataset.id,
      'order_type': 0
    }
    var title = that.data.travelInfo.title.substring(0, 14) + '...';
    var price = '跟团价：' + that.data.currentTerm.man_price;
    wx.showLoading();
    ajax.wxRequest('POST', 'Travel/getWxacode', item,
      (res) => {
        //console.log(res)
        var url = res.data.acode_url;
        // var qrbg = res.data.qrcode_bg;
        //获取网络图片本地路径
        wx.getImageInfo({
          src: that.data.imgUrls[0].pic,
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
              fail: function(res) {}
            });
          },
          fail: function(res) {}
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
  save: function() {
    var that = this;
    wx.canvasToTempFilePath({ //canvas 生成图片 生成临时路径
      canvasId: 'shareCanvas',
      success: function(res) {
        ////console.log(res)
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
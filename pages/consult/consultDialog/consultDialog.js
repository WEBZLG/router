var app = getApp();
var ajax = require("../../../utils/ajax.js");
var socketOpen = false;
var SocketTask;
var url = 'wss://travel.liaofankeji.com/wss';
Page({
  data: {
    inputText: '', //内容
    dataList:[],//聊天记录
    gid: '', //对话id
    uid: '', //发送者
    toid: '', //接受者
    type: '', //接收对象类型 0-团长 1-分销商
    pageIndex:'1'//页码
  },
  // 页面加载完成
  onReady: function () {
    var that = this;
    var uid = app.globalData.uid;
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
      this.webSocket()
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var onMessage_data = JSON.parse(onMessage.data)
      that.bindUser(uid, onMessage_data.client_id,0)
      that.bottom()
    })
  },
  // 页面加载
  onLoad: function (options) {
    var that = this;
    //console.log(options)
    this.setData({
      gid: options.id,
      toid: options.tid
    })
    if (options.type) {
      var type = options.type;
      that.setData({
        type: type
      })
    }

    this.bottom();
  },
  onShow: function (e) {
    var that = this;
    var uid = app.globalData.uid;
    this.setData({
      uid: uid
    })
    if (!socketOpen) {
      this.webSocket()
    }
  },

  onHide: function () {
    // SocketTask.close(function (close) {
    //   console.log('关闭 WebSocket 连接。', close)
    // })
  },
    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    SocketTask.close(function (close) {
      console.log('关闭 WebSocket 连接。', close)
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    var uid = app.globalData.uid;
    this.getData(uid, that.data.gid, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var uid = app.globalData.uid;
    this.setData({
      pageIndex : that.data.pageIndex*1 + 1
    })
    console.log(this.data.pageIndex)
    that.getData(uid, that.data.gid, that.data.pageIndex)
  },
  webSocket: function () {
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: err,
        })
      },
    })
  },

  // 输入内容
  inputText(e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  // 获取hei的id节点然后屏幕焦点调转到这个节点  
  bottom: function () {
    var that = this;
    this.setData({
      scrollTop: 1000000
    })
  },
  // 获取聊天记录
  getData(uid, gid, page) {
    var that = this;
    var item = {
      uid: uid,
      group_id: gid,
      page: page
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Chat/getChatRecord', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList: res.data
          })
          for (var i in res.data) {
            if (res.data[i].fromid != that.data.uid) {
              that.setData({
                type: res.data[i].type
              })
            }
          }
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
  // 绑定uid
  bindUser(uid, cid) {
    var that = this;
    var item = {
      uid: uid,
      client_id: cid,
      type: 0
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Chat/bind', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            isBand: true
          })
          that.getData(uid, that.data.gid, 1)
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

  // 发送消息
  sendMessage() {
    var that = this;
    var item = {
      uid: that.data.uid,
      group_id: that.data.gid,
      toid: that.data.toid,
      type: that.data.type,
      message: that.data.inputText
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Chat/sendMessage', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          // that.getData(item.uid, that.data.gid, 1)
          if (socketOpen) {
            // 如果打开了socket就发送数据给服务器
            sendSocketMessage(that.data.inputText)
            that.bottom()
          }
          this.setData({
            inputText: ''
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

  //通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
  sendSocketMessage(msg) {
    var that = this;
    console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
    SocketTask.send({
      data: JSON.stringify(msg)
    }, function (res) {
      console.log('已发送', res)
    })
  }
})
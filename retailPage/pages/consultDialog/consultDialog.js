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
    pageIndex:'1',//页码
    toUserName:'淘淘趣游'
  },
  // 页面加载完成
  onReady: function() {
    var that = this;
    var uid = app.globalData.uid;
    SocketTask.onOpen(res => {
      socketOpen = true;
      //console.log('监听 WebSocket 连接打开事件。', res)
    })
    SocketTask.onClose(onClose => {
      //console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
    })
    SocketTask.onError(onError => {
      //console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var onMessage_data = JSON.parse(onMessage.data)
      if(onMessage_data.type){
        that.bindUser(uid, onMessage_data.client_id,'download')
      }else{
        let onMessage = {
          add_time:onMessage_data.add_time,
          content:onMessage_data.message,
          nick:onMessage_data.name,
          headimgurl:onMessage_data.headimgurl
        }
        that.setData({
          dataList:that.data.dataList.concat(onMessage)
        })
        that.pageScrollToBottom();
      }
    })
  },
  // 页面加载
  onLoad: function(options) {
    var gid = options.id;
    var toid = options.tid;
    this.setData({
      gid: gid,
      toid: toid,
    })
    if (options.type) {
      var type = options.type;
      that.setData({
        type: type
      })
    }
  },
  onShow: function(e) {
    var that = this;
    var uid = app.globalData.uid;
    this.setData({
      uid:uid
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
    this.setData({
      pageIndex : that.data.pageIndex*1 + 1
    })
    that.getData(uid, that.data.gid, that.data.pageIndex,'upload')
  },

  webSocket: function() {
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function(res) {
        //console.log('WebSocket连接创建', res)
      },
      fail: function(err) {
        wx.showToast({
          title: err,
        })
        //console.log(err)
      },
    })
  },

  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#list').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  inputText(e){
    this.setData({
      inputText:e.detail.value
    })
  },
  // 获取聊天记录
  getData(uid, gid, page,type) {
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
          if(type=='upload'){
            if(res.data.length==0){
              wx.showToast({
                title: '木有数据了~',
                icon:'none'
              })
            }
            that.setData({
              dataList: res.data.concat(that.data.dataList)
            });
            wx.stopPullDownRefresh();
          }else{
            that.setData({
              dataList: res.data
            })
            that.pageScrollToBottom()
          }
          for (var i in res.data) {
            if (res.data[i].fromid != that.data.uid) {
              that.setData({
                type: res.data[i].type,
                toUserName:res.data[i].nick
              })
              wx.setNavigationBarTitle({
                title: res.data[i].nick
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
  // 绑定
  bindUser(uid, cid) {
    var that = this;
    var item = {
      uid: uid,
      client_id: cid,
      type: 1
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
          that.getData(uid, that.data.gid,1,'download')
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
    if(that.data.inputText.replace(/\s+/g,"")==''){
      wx.showToast({
        title: '发送内容不能为空',
        icon: "none"
      })
      return false;
    }
    var item = {
      uid: that.data.uid,
      group_id: that.data.gid,
      toid: that.data.toid,
      type: 0,
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
          if (socketOpen) {
            // 如果打开了socket就发送数据给服务器
            console.log(socketOpen)
            that.sendSocketMessage(that.data.inputText)
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
      data:msg,
      success:function(res){
        console.log(res)
        that.getData(that.data.uid, that.data.gid,1,'download')
      }
    })
  }
})

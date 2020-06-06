var app = getApp();
var ajax = require("../../../utils/ajax.js");
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'wss://travel.liaofankeji.com/wss';
Page({
  data: {
    user_input_text: '', //用户输入文字
    inputValue: '',
    returnValue: '',
    addImg: false,
    allContentList: [],
    num: 0,
    dataList: [],
    gid: '',
    uid: '',
    inputText:'',
    type:'',
    toid:''
  },
  inputText(e){
    this.setData({
      inputText:e.detail.value
    })
  },
  submit(){
    var that = this;
    var item = {
      uid: that.data.uid,
      group_id:that.data.gid,
      toid: that.data.toid,
      type:that.data.type,
      message:that.data.inputText
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Chat/sendMessage', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.getData(item.uid, that.data.gid, 1)
          this.setData({
            inputText:''
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
  cancel(){
    this.setData({
      inputText:''
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
    this.bottom();
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
    if (that.data.dataList==''){

    that.getData(uid, that.data.gid, 1)
    }
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
      this.webSocket()
    })
    SocketTask.onError(onError => {
      //console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var onMessage_data = JSON.parse(onMessage.data)
      that.bindUser(uid, onMessage_data.client_id)
      // if (onMessage_data.cmd == 1) {
      //   that.setData({
      //     link_list: text
      //   })
      //   //console.log(text, text instanceof Array)
      //   // 是否为数组
      //   if (text instanceof Array) {
      //     for (var i = 0; i < text.length; i++) {
      //       text[i]
      //     }
      //   } else {

      //   }
      //   that.data.allContentList.push({ is_ai: true, text: onMessage_data.body });
      //   that.setData({
      //     allContentList: that.data.allContentList
      //   })
      //   that.bottom()
      // }
    })
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
          title: '网络异常！',
        })
        //console.log(err)
      },
    })
  },

  // 提交文字
  submitTo: function(e) {
    let that = this;
    var data = {
      body: that.data.inputValue,
    }

    if (socketOpen) {
      // 如果打开了socket就发送数据给服务器
      sendSocketMessage(data)
      this.data.allContentList.push({
        is_my: {
          text: this.data.inputValue
        }
      });
      this.setData({
        allContentList: this.data.allContentList,
        inputValue: ''
      })

      that.bottom()
    }
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onHide: function() {
    SocketTask.close(function(close) {
      //console.log('关闭 WebSocket 连接。', close)
    })
  },

  // 获取hei的id节点然后屏幕焦点调转到这个节点  
  bottom: function() {
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
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList: res.data
          })
          for (var i in res.data){
            if (res.data[i].fromid!=that.data.uid){
              this.setData({
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
  // 绑定
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
})

//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  var that = this;
  //console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function(res) {
    console.log('已发送', res)
  })
}
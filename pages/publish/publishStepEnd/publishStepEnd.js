// pages/publish/publishStep2/publishStepEnd.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    jsonData: '',
    newData: ''
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // //console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function() {
        //console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function(res) {
        //console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 4,
      success: function(res) {
        ajax.uploadimages(res.tempFilePaths, function(resp) {
          var array = resp;
          var newImages = [];
          //console.log(array)
          for (var idx in array) {
            var data = JSON.parse(array[idx]);
            newImages.push(ajax.resPath + data.data.path)
            that.editorCtx.insertImage({
              src: newImages[idx],
              data: {},
              width: '100%',
              success: function(res) {
                //console.log(res)
              }
            })
          }
        })
      }
    })
  },
  getInput(e) {
    var html = e.detail.html;
    //console.log(html)
    this.setData({
      newData: html
    })
  },
  nextStep() {
    var that = this;
    if (that.data.newData == '') {
      wx.showToast({
        title: '请填写装备提示',
        icon:"none"
      });
      return false;
    }
    app.globalData.stepData.stepEnd = that.data.newData;
    //console.log(app.globalData.stepData)
    var submitData = app.globalData.stepData;
    var item = {
      'uid': app.globalData.uid,
      // 'uid': 16,
      'pic': submitData.step1.images,
      'title': submitData.step1.title,
      'sign_time': submitData.step1.signStartTime,
      'end_time': submitData.step1.signEndTime,
      'start_time': submitData.step1.startTime,
      'return_time': submitData.step1.endTime,
      'start_address': submitData.step1.startPlace,
      'return_address': submitData.step1.endPlace,
      'num': submitData.step1.members,
      'is_insure':submitData.step1.insurance,
      'trip': submitData.step3,
      'outlay': submitData.step4,
      'sign_notes': submitData.step5,
      'equipment_notes': submitData.stepEnd,
      'cid': submitData.step1.tags,
      'price': submitData.step1.price,
      'children_price': submitData.step1.childPrice,
      'tour_fee': submitData.step2,
      'sign_rule': submitData.step1.signRule
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'User/pubPink', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
          });
          setTimeout(function(){
            wx.switchTab({
              url: '../../myself/myself',
            })
          },2000)
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
  }
})
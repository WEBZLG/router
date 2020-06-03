// pages/publish/publishStep2/publishStep2.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     jsonData: '', //上一步数据
//     textarea: '',
//     images: []
//   },
//   textarea(e) {
//     var textarea = e.detail.value;
//     this.setData({
//       textarea: textarea
//     })
//   },

//   // 选取照片
//   chooseImage(e) {
//     wx.chooseImage({
//       count: 4,
//       sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
//       sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
//       success: res => {
//         //console.log(res)
//         this.setData({
//           images: res.tempFilePaths,
//         })
//       }
//     })
//   },
//   // 删除图片
//   deleteImg(e) {
//     var that = this;
//     var idx = e.currentTarget.dataset.idx;
//     var images = that.data.images;
//     images.splice(idx, 1);
//     this.setData({
//       images: images
//     });
//   },
//   nextStep() {
//     var that = this;
//     var textarea = this.data.textarea;
//     var images = this.data.images;
//     if (textarea == '') {
//       wx.showToast({
//         title: '请输入景点简介',
//         icon: 'none'
//       });
//       return false;
//     } else if (images == '') {
//       wx.showToast({
//         title: '请上传图片',
//         icon: 'none'
//       });
//       return false;
//     }
//     ajax.uploadimages(images, function(res) {
//       var array = res;
//       var newImages = [];
//       //console.log(res)
//       for (var idx in array) {
//         var data = JSON.parse(array[idx]);
//         newImages.push(data.data.path)
//       }
//       //console.log(newImages)
//       var jsonData = that.data.jsonData;
//       jsonData.introduce = that.data.textarea;
//       jsonData.images2 = newImages;
//       jsonData = JSON.stringify(jsonData);
//       wx.navigateTo({
//         url: '../publishStep3/publishStep3?jsonData=' + jsonData
//       })
//     })
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function(options) {
//     this.setData({
//       jsonData: JSON.parse(options.jsonData)
//     })
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function() {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function() {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function() {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function() {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function() {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function() {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function() {

//   }
// })

Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    jsonData:'',
    newData:''
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    // this.setData({
    //   jsonData: JSON.parse(options.jsonData)
    // })
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
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
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // //console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        //console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
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
      success: function (res) {
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
          success: function (res) {
            //console.log(res)
          }
        })
      }
    })
      }
    })
  },
  getInput(e){
    var html = e.detail.html;
    //console.log(html)
    this.setData({
      newData:html
    })
  },
  nextStep(){
    var that = this;
    if (that.data.newData==''){
      wx.showToast({
        title: '请填写活动介绍',
        icon: "none"
      });
      return false;
    }
    app.globalData.stepData.step2 = that.data.newData
    wx.navigateTo({
      url: '../publishStep3/publishStep3'
    })
  }
})

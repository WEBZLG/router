// pages/retailPage/wantRetail/wantRetail.js
const app = getApp()
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid:'',
    dataList:{},
    manprice:'',
    childprice:'',
    startTime:'',
    scale:'',
    images:'',
    iconIsShow:true
  },
  // 分销价格成人
  manprice(e){
    var price = e.detail.value;
    this.setData({
      manprice:price
    })
  },
  // 分销价格儿童
  childprice(e) {
    var price = e.detail.value;
    this.setData({
      childprice: price
    })
  },
  // 分销价格比例
  scale(e) {
    var price = e.detail.value;
    this.setData({
      scale: price
    })
  },
  // 分销结束时间
  chooseTime(e){
    var tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '../datepicker/datepicker?tid='+tid,
    })
  },
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        this.setData({
          images: res.tempFilePaths[0],
          iconIsShow: false
        })
      }
    })
  },
  deleteImg(e) {
    this.setData({
      images: '',
      iconIsShow: true
    });
  },

  submit(){
    var that = this;
    var scale = this.data.scale;
    var manprice = this.data.manprice;
    var childprice = this.data.childprice;
    var endTime = this.data.startTime;
    var images = this.data.images;
    var dataList = this.data.dataList;
    if(manprice==''){
      wx.showToast({
        title: '请输入成人分销价格',
        icon:"none"
      });
      return false;
    } else if (manprice < dataList.man_price){
      wx.showToast({
        title: '分销价格不得小于供应商价格',
        icon: "none"
      });
      return false;

    } else if (childprice < dataList.children_price){
      wx.showToast({
        title: '分销价格不得小于供应商价格',
        icon: "none"
      });
      return false;
    } else if (scale < 1 || scale>100){
      wx.showToast({
        title: '佣金比例设置不正确',
        icon: "none"
      });
      return false;
    }else if(endTime==''){
      wx.showToast({
        title: '请选择结束日期',
        icon: "none"
      });
      return false;
    }else if(images==''){
      wx.showToast({
        title: '请上传一张图片作为封面',
        icon: "none"
      });
      return false;
    }else{
      wx.showLoading({ mask: "true" })
      ajax.uploadimgRetail(images, function (res) {
        console.log(res)
        var pic = res.data.path;
        var tid = that.data.tid;
        var vTime = endTime;
        var action = 'confirm';
        var poyalty = scale;
        
        that.getData(tid, action, vTime, manprice, childprice, poyalty, pic)
      })
    }
  },


  getData(tid, action,vTime,manprice,childprice,poyalty,pic) {
    var that = this;
    var uid = app.globalData.uid;
    var item = {
      'merchid': uid,
      'tid': tid,
      'action':action,
      'validity_time':vTime,
      'price': manprice,
      'children_price':childprice,
      'royalty': poyalty,
      'pic':pic
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'Merchant/retail', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          if (action==''){
            that.setData({
              dataList: res.data
            });
            wx.setNavigationBarTitle({
              title: res.data.title
            })
          }else{
            wx.showToast({
              title: res.msg
            });
            setTimeout(function(){
              wx.navigateBack({
                detal:1
              })
            },1500)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tid = options.sid;
    this.setData({
      tid:tid
    })
    this.getData(tid, '', '', '', '','','')
    
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
  onShareAppMessage: function () {

  }
})
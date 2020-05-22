// pages/myself/goodAt/goodAt.js
const app = getApp();
var ajax = require("../../../utils/ajax.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagList:'',
    checkTags: [], //选中的标签
  },
  // 选中 
  itemSelected: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = this.data.tagList[index];
    item.isSelected = !item.isSelected;
    if (item.isSelected) {
      that.setData({
        checkTags: that.data.checkTags.concat(item.id)
      })
      console.log(that.data.checkTags)
    } else if (!item.isSelected) {
      that.setData({
        checkTags: that.data.checkTags.filter(function (msg) {
          return msg != item.id
        })
      })
      console.log(that.data.checkTags)
    }
    that.setData({
      tagList: this.data.tagList,
    });
  },
  // 获取标签类型
  getTags() {
    var that = this;
    var item = {}
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Index/getCategory', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          var array = res.data;
          wx.hideLoading();
          for (var idx in array) {
            var obj = array[idx];
            obj.isSelected = false;
            array[idx] = obj;
            var check = that.data.checkTags;
            console.log(check)
            for (var j in check){
              if (array[idx].id==check[j]){
                obj.isSelected = true;
                array[idx] = obj;
              }
            }
          }
          that.setData({
            tagList: array
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
  submit(uid,cid) {
    var that = this;
    var uid = app.globalData.uid;
    var cid = that.data.checkTags;
    var item = {
      uid:uid,
      cid:cid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'User/skill', item,
      (res) => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 200) {
          var array = res.data;
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            icon:"none"
          })
          setTimeout(function(){
            wx.navigateBack({
              detal:1
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var skill = JSON.parse(options.skill);
    console.log(skill)
    for(var i in skill){
      this.setData({
        checkTags:that.data.checkTags.concat(skill[i].id)
      })
    }
    this.getTags();
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
// pages/home/seckillGroup/seckillGroup.js
const app = getApp()
var ajax = require("../../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: "",
    middleIdx: '',
    title1: '',
    title2: '',
    title3: '',
    title4: '',
    title5: '',
    interval1: '',
    interval2: '',
    interval3: '',
    interval4: '',
    interval5: '',
    interval6: '',
    banner: '',
    dataList: [],
    btnShow: false,
    haveTime: ''
  },
  chooseTime(e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      idx: idx
    });
    if (that.data.middleIdx == idx) {
      that.setData({
        btnShow: true
      });
    } else {
      that.setData({
        btnShow: false
      });
    }
    if (idx == 0) {
      that.setData({
        stime: that.data.interval1,
        etime: that.data.interval2
      });
    } else if (idx == 1) {
      that.setData({
        stime: that.data.interval2,
        etime: that.data.interval3
      });
    } else if (idx == 2) {
      that.setData({
        stime: that.data.interval3,
        etime: that.data.interval4
      });
    } else if (idx == 3) {
      that.setData({
        stime: that.data.interval4,
        etime: that.data.interval5
      });
    } else if (idx == 4) {
      that.setData({
        stime: that.data.interval5,
        etime: that.data.interval6
      });
    }
    this.getData(that.data.stime, that.data.etime)
  },

  // 秒杀详情
  seckillDetails(e) {
    var tid = e.currentTarget.dataset.tid;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../seckillDetails/seckillDetails?title='+title+'&tid='+tid,
    })
  },
  getData(stime, etime) {
    var that = this;
    var item = {
      stime: stime,
      etime: etime
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'Index/seckill', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dataList: res.data.list,
            banner: res.data.pic
          });

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
    var timestamp = new Date().getTime(); //当前时间戳
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = myDate.getMonth() * 1 + 1; //获取当前月份(0-11,0代表1月)
    var day = myDate.getDate(); //获取当前日(1-31)
    if (month < 10) {
      month = "0" + month
    }
    if (day < 10) {
      day = "0" + day
    }
    var yearMonth = year + "-" + month + "-" + day;
    var time1 = yearMonth + " " + "00:00:00"
    var time2 = yearMonth + " " + "08:00:00"
    var time3 = yearMonth + " " + "12:00:00"
    var time4 = yearMonth + " " + "16:00:00"
    var time5 = yearMonth + " " + "20:00:00"
    var time6 = yearMonth + " " + "24:00:00"
    this.setData({
      interval1: time1,
      interval2: time2,
      interval3: time3,
      interval4: time4,
      interval5: time5,
      interval6: time6
    })
    var oldTime1 = new Date(time1).getTime();
    var oldTime2 = new Date(time2).getTime();
    var oldTime3 = new Date(time3).getTime();
    var oldTime4 = new Date(time4).getTime();
    var oldTime5 = new Date(time5).getTime();
    var oldTime6 = new Date(time6).getTime();
    if (timestamp > oldTime1 && oldTime2 > timestamp) {
      // //console.log("1")
      this.setData({
        idx: 0,
        middleIdx: 0,
        title1: '进行中',
        title2: '即将开始',
        title3: '即将开始',
        title4: '即将开始',
        title5: '即将开始',
        stime: time1,
        etime: time2,
        btnShow: true
      })
      var runTime = parseInt((oldTime2 - timestamp) / 1000);
      var hours = Math.floor(runTime / 3600);
      var minutes = Math.floor(runTime / 60 );
      if (minutes < 10) {
        minutes = "0" + minutes
      }
      this.setData({
        haveTime: hours + ":" + minutes
      })
    } else
    if (timestamp > oldTime2 && oldTime3 > timestamp) {
      // //console.log("2")
      this.setData({
        idx: 1,
        middleIdx: 1,
        title1: '已结束',
        title2: '进行中',
        title3: '即将开始',
        title4: '即将开始',
        title5: '即将开始',
        stime: time2,
        etime: time3,
        btnShow: true
      })
      var runTime = parseInt((oldTime3 - timestamp) / 1000);
      var hours = Math.floor(runTime / 3600);
      var minutes = Math.floor(runTime / 60);
      if (minutes < 10) {
        minutes = "0" + minutes
      }
      this.setData({
        haveTime: hours + ":" + minutes
      })
    } else
    if (timestamp > oldTime3 && oldTime4 > timestamp) {
      // //console.log("3")
      this.setData({
        idx: 2,
        middleIdx: 2,
        title1: '已结束',
        title2: '已结束',
        title3: '进行中',
        title4: '即将开始',
        title5: '即将开始',
        stime: time3,
        etime: time4,
        btnShow: true
      })
      var runTime = parseInt((oldTime4 - timestamp) / 1000);
      var hours = Math.floor(runTime / 3600);
      var minutes = Math.floor(runTime / 60);
      if(minutes<10){
        minutes = "0"+minutes
      }
      this.setData({
        haveTime:hours+":"+minutes
      })
    } else
    if (timestamp > oldTime4 && oldTime5 > timestamp) {
      // //console.log("4")
      this.setData({
        idx: 3,
        middleIdx: 3,
        title1: '已结束',
        title2: '已结束',
        title3: '已结束',
        title4: '进行中',
        title5: '即将开始',
        stime: time4,
        etime: time5,
        btnShow: true
      })
      var runTime = parseInt((oldTime5 - timestamp) / 1000);
      var hours = Math.floor(runTime / 3600);
      var minutes = Math.floor(runTime / 60 );
      if (minutes < 10) {
        minutes = "0" + minutes
      }
      this.setData({
        haveTime: hours + ":" + minutes
      })
    } else
    if (timestamp > oldTime5 && oldTime6 > timestamp) {
      // //console.log("5")
      this.setData({
        idx: 4,
        middleIdx: 4,
        title1: '已结束',
        title2: '已结束',
        title3: '已结束',
        title4: '已结束',
        title5: '进行中',
        stime: time5,
        etime: time6,
        btnShow: true
      })
      var runTime = parseInt((oldTime6 - timestamp) / 1000);
      var hours = Math.floor(runTime / 3600);
      var minutes = Math.floor(runTime / 60);
      if (minutes < 10) {
        minutes = "0" + minutes
      }
      this.setData({
        haveTime: hours + ":" + minutes
      })
    }

    this.getData(this.data.stime, this.data.etime)
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
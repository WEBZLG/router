const app = getApp()
var ajax = require("../../../utils/ajax.js")

Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    timeData: [],
    activeIdx: '0'
  },
  onLoad: function (options) {
    var tid = options.tid;
    this.getTime(tid);
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    var that = this;
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate(),
    });
    //console.log(year, month)
    // this.dateInit(year * 1, month* 1);
  },
  onShow: function () {

  },
  lookHuoDong(e) {
    //console.log(e);
    var id = e.currentTarget.dataset.id;
    var year = e.currentTarget.dataset.year;
    var month = e.currentTarget.dataset.month;
    var day = e.currentTarget.dataset.datenum;
    var time = year + '-' + month + '-' + day;
    var price = e.currentTarget.dataset.price;
    var place = e.currentTarget.dataset.place;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      startTime: time,
      price: price,
      place: place,
      termId:id
    })
    //最后就是返回上一个页面。
    wx.navigateBack({
      delta: 1
    })
  },
  dateInit: function (setYear, setMonth) {
    // debugger;
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek * 1 + dayNums * 1;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          month: month + 1
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    var that = this;
    //全部时间的月份都是按0~11基准，显示月份才+1
    // let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    // let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    // this.setData({
    //   year: year,
    //   month: (month + 1)
    // })
    // this.dateInit(year, month);
    var idx = this.data.activeIdx;
    if (idx > 0) {
      this.setData({
        activeIdx: that.data.activeIdx * 1 - 1
      });
      idx = this.data.activeIdx * 1;
    }
    var arr = this.data.timeData;
    var year = this.data.timeData[idx].key.split('.')[0];
    var month = this.data.timeData[idx].key.split('.')[1] - 1;
    this.dateInit(year, month);
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    var that = this;
    // 全部时间的月份都是按0~11基准，显示月份才+1
    // let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    // let month = this.data.month > 11 ? 0 : this.data.month;
    // this.setData({
    //   year: year,
    //   month: (month + 1)
    // })
    var datalength = this.data.timeData.length;
    var idx = this.data.activeIdx;
    if (idx < datalength - 1) {
      this.setData({
        activeIdx: that.data.activeIdx * 1 + 1
      });
      idx = this.data.activeIdx * 1;
    }
    var arr = this.data.timeData;
    var year = this.data.timeData[idx].key.split('.')[0];
    var month = this.data.timeData[idx].key.split('.')[1] - 1;
    this.dateInit(year, month);
  },
  changeTime(e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      activeIdx: idx
    });
    var arr = this.data.timeData;
    var year = this.data.timeData[idx].key.split('.')[0];
    var month = this.data.timeData[idx].key.split('.')[1] - 1;
    //console.log(year,month)
    this.dateInit(year, month);
  },
  getTime(tid) {
    var that = this;
    var uid = app.globalData.uid;
    var item = {
      'merchid':uid,
      'tid': tid
    }
    wx.showLoading({
      mask: 'true'
    });
    ajax.wxRequest('POST', 'Merchant/getTerm', item,
      (res) => {
        //console.log(res)
        wx.hideLoading();
        if (res.code == 200) {
          var obj = res.data
          wx.hideLoading();
          var arr = []
          for (let i in obj) {
            let o = {};
            o['key'] = i;
            o['value'] = obj[i]
            arr.push(o)
          }
          that.setData({
            timeData: arr
          });
          //console.log(that.data.timeData)
          var firstYear = arr[0].key.split('.')[0];
          var firstMonth = arr[0].key.split('.')[1]-1;
          //console.log(firstYear, firstMonth)
          this.dateInit(firstYear * 1, firstMonth * 1);
          
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
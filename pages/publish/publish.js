// pages/publish/publish.js
const app = getApp();
var ajax = require("../../utils/ajax.js");
var arrAll = require("../../utils/arrAll.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    num: 1, // input默认是1  
    minusStatus: 'disabled', // 使用data数据对象设置样式名  
    value: [0, 0, 0], // 地址选择器省市区 暂存 currentIndex
    endValue: [0, 0, 0],
    region: '', //所在地区
    endRegion: '', //返回地点
    regionValue: [0, 0, 0], // 地址选择器省市区 最终 currentIndex
    provinces: arrAll.arrAll, // 一级地址
    citys: [], // 二级地址
    endCitys: [], // 二级地址
    areas: [], // 三级地址
    endAreas: [], // 三级地址
    visible: false, //弹窗显隐
    cilckType: '', //地点选择类型
    startDate: '', //出发时间
    endDate: '', //返回时间
    signStartDate: '', //签到开始
    signEndDate: '', //签到结束
    nowTime: '', //当前时间
    lineTitle: '', //线路标题
    tagList: [], //标签类型
    checkTags: [], //选中的标签
    images: [], //上传图片
    insurance: '1', //保险
    manPrice: "", //成人价格，
    childPrice: '', //儿童价格
    limitType: "1", //报名人员类型
    limitArray: ['成人和儿童（1.2米以下）可以报名', '只有成人可以报名', '只有儿童（1.2米以下）可以报名'],
    isReal: false,
    dateStr1: '0',
    dateStr2: '0',
    dateStr3: '0',
    dateStr4: '0'
  },
  // 路线标题
  lineTitle(e) {
    this.setData({
      lineTitle: e.detail.value
    })
  },

  // 限制类型
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      limitType: e.detail.value * 1 + 1
    })
  },

  // 设置价格成人
  setManPrice(e) {
    var price = e.detail.value;
    this.setData({
      manPrice: price
    })
  },
  // 设置价格儿童
  setChildPrice(e) {
    var price = e.detail.value;
    this.setData({
      childPrice: price
    })
  },

  // 选择日期
  bindDateChange: function(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var newDate = new Date(e.detail.value).getTime();
    //console.log(newDate)
    if (type == 0) {
      if (newDate < that.data.dateStr1 ||newDate == that.data.dateStr1) {
        wx.showToast({
          title: '出发时间不得早于或同于报名开始时间',
          icon: 'none'
        })
        return false;
      } else if (newDate < that.data.dateStr2 || newDate == that.data.dateStr2) {
        wx.showToast({
          title: '出发时间不得早于或同于报名结束时间',
          icon: 'none'
        })
        return false;
      } else if (newDate > that.data.dateStr4) {
        wx.showToast({
          title: '出发时间不得晚于返回时间',
          icon: 'none'
        })
        return false;
      } else {
        that.setData({
          startDate: e.detail.value,
          dateStr3: newDate
        })
      }

    } else if (type == 1) {
      if (newDate < that.data.dateStr1) {
        wx.showToast({
          title: '返回时间不得早于报名开始时间',
          icon: 'none'
        })
        return false;
      } else if (newDate < that.data.dateStr2) {
        wx.showToast({
          title: '返回时间不得早于报名结束时间',
          icon: 'none'
        })
        return false;
      } else if (newDate < that.data.dateStr3) {
        wx.showToast({
          title: '返回时间不得早于出发时间',
          icon: 'none'
        })
        return false;
      } else {
        that.setData({
          endDate: e.detail.value,
          dateStr4: newDate
        })
      }
    }
    //console.log(e.detail.value)
  },
  // 选择签到日期
  signDateChange: function(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var newDate = new Date(e.detail.value).getTime();
    //console.log(newDate)
    //console.log(that.data.dateStr2)
    if (type == 0) {
      if (newDate > that.data.dateStr2) {
        wx.showToast({
          title: '报名开始时间不得晚于报名结束时间',
          icon: 'none'
        })
        return false;
      } else if (newDate > that.data.dateStr3) {
        wx.showToast({
          title: '报名开始时间不得晚于出发时间',
          icon: 'none'
        })
        return false;
      } else if (newDate > that.data.dateStr4) {
        wx.showToast({
          title: '报名开始时间不得晚于返回时间',
          icon: 'none'
        })
        return false;
      } else {
        that.setData({
          signStartDate: e.detail.value,
          dateStr1: newDate
        })
      }
    } else if (type == 1) {
      if (newDate < that.data.dateStr1) {
        wx.showToast({
          title: '报名结束时间不得早于开始时间',
          icon: 'none'
        })
        return false;
      } else if (newDate > that.data.dateStr3) {
        wx.showToast({
          title: '报名开始时间不得晚于出发时间',
          icon: 'none'
        })
        return false;
      } else if (newDate > that.data.dateStr4) {
        wx.showToast({
          title: '报名开始时间不得晚于返回时间',
          icon: 'none'
        })
        return false;
      } else {
        that.setData({
          signEndDate: e.detail.value,
          dateStr2: newDate
        })
      }
    }
  },
  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 选中 
  itemSelected: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = this.data.tagList[index];
    item.isSelected = !item.isSelected;
    if (item.isSelected) {
      that.setData({
        checkTags: that.data.checkTags.concat(item.id)
      })
      //console.log(that.data.checkTags)
    } else if (!item.isSelected) {
      that.setData({
        checkTags: that.data.checkTags.filter(function(msg) {
          return msg != item.id
        })
      })
      //console.log(that.data.checkTags)
    }
    that.setData({
      tagList: this.data.tagList,
    });
  },
  //关闭弹窗
  closePopUp() {
    this.setData({
      visible: false
    })
  },
  //选择地点
  pickAddress(e) {
    var type = e.currentTarget.dataset.type;
    //console.log(type)
    this.setData({
      visible: true,
      cilckType: type
      // value: [...this.data.regionValue]
    })
  },
  // 处理省市县联动逻辑 并保存 value
  cityChange(e) {
    var that = this;
    var value = e.detail.value
    var provinceNum = value[0]
    var cityNum = value[1]
    var areaNum = value[2]
    if (this.data.cilckType == 0) {
      this.setData({
        citys: that.data.provinces[provinceNum].sub,
        areas: that.data.provinces[provinceNum].sub[cityNum].sub,
        value: [provinceNum, cityNum, areaNum]
      })
    } else if (this.data.cilckType) {
      // var endValue = e.detail.endValue
      // var provinceNum = value[0]
      // var cityNum = value[1]
      // var areaNum = value[2]
      // this.setData({
      //   endCitys: that.data.provinces[provinceNum].sub,
      //   endAreas: that.data.provinces[provinceNum].sub[cityNum].sub,
      //   endValue: [provinceNum, cityNum, areaNum]
      // })
      this.setData({
        citys: that.data.provinces[provinceNum].sub,
        areas: that.data.provinces[provinceNum].sub[cityNum].sub,
        endValue: [provinceNum, cityNum, areaNum]
      })
    }

  },
  // 点击地区选择取消按钮
  cityCancel(e) {
    this.setData({
      visible: false
    })
  },
  // 点击地区选择确定按钮
  citySure(e) {
    this.setData({
      visible: false
    })
    // 将选择的城市信息显示到输入框
    if (this.data.cilckType == 0) {
      var value = this.data.value
      try {
        var region =
          (this.data.provinces[value[0]].name || '') +
          (this.data.citys[value[1]].name || '')
        if (this.data.areas.length > 0) {
          region = region + this.data.areas[value[2]].name || ''
        } else {
          this.data.value[2] = 0
        }
      } catch (error) {
        //console.log('adress select something error')
      }
      this.setData({
        region: region,
        // regionValue: [...this.data.value]
      })
    } else if (this.data.cilckType == 1) {
      var value = this.data.endValue
      try {
        var endRegion =
          (this.data.provinces[value[0]].name || '') +
          (this.data.citys[value[1]].name || '')
        if (this.data.areas.length > 0) {
          endRegion = endRegion + this.data.areas[value[2]].name || ''
        } else {
          this.data.value[2] = 0
        }
      } catch (error) {
        //console.log('adress select something error')
      }
      this.setData({
        endRegion: endRegion,
        // regionValue: [...this.data.value]
      })
    }
  },
  // 选取照片
  chooseImage(e) {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        //console.log(res)
        this.setData({
          images: res.tempFilePaths,
        })
      }
    })
  },
  // 删除图片
  deleteImg(e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var images = that.data.images;
    images.splice(idx, 1);
    this.setData({
      images: images
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
        //console.log(res)
        if (res.code == 200) {
          var array = res.data;
          wx.hideLoading();
          for (var idx in array) {
            var obj = array[idx];
            obj.isSelected = false;
            array[idx] = obj;
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

  submit() {
    var that = this;
    ajax.checkLogin('您未登录无法发布', function() {
      if (that.data.isReal == false) {
        wx.showToast({
          title: '您未实名认证，无法发布拼团',
          icon: 'none'
        })
        return false;
      }
      var title = that.data.lineTitle;
      var tags = that.data.checkTags;
      var manPrice = that.data.manPrice;
      var childPrice = that.data.childPrice;
      var members = that.data.num;
      var startPlace = that.data.region;
      var endPlace = that.data.endRegion;
      var signStartTime = that.data.signStartDate;
      var signEndTime = that.data.signEndDate;
      var startTime = that.data.startDate;
      var endTime = that.data.endDate;
      var insurance = that.data.insurance;
      var images = that.data.images;
      var signRule = that.data.limitType;
      if (title == '') {
        wx.showToast({
          title: '请输入线路标题',
          icon: 'none'
        });
      } else if (images == '') {
        wx.showToast({
          title: '请上传图片',
          icon: 'none'
        });
      } else if (tags == '') {
        wx.showToast({
          title: '请选择标签',
          icon: 'none'
        });
      } else if (signRule == 1 && childPrice == '') {
        wx.showToast({
          title: '请设置拼团金额',
          icon: 'none'
        })
      } else if (signRule == 1 && manPrice == '') {
        wx.showToast({
          title: '请设置拼团金额',
          icon: 'none'
        })
      } else if (signRule == 2 && manPrice == '') {
        wx.showToast({
          title: '请设置拼团金额',
          icon: 'none'
        })
      } else if (signRule == 3 && childPrice == '') {
        wx.showToast({
          title: '请设置拼团金额',
          icon: 'none'
        })
      } else if (startPlace == '') {
        wx.showToast({
          title: '请选择出发地',
          icon: 'none'
        });
      } else if (endPlace == '') {
        wx.showToast({
          title: '请选择目的地',
          icon: 'none'
        });
      } else if (signStartTime == '') {
        wx.showToast({
          title: '请选择签到开始日期',
          icon: 'none'
        });
      } else if (signEndTime == '') {
        wx.showToast({
          title: '请选择签到结束日期',
          icon: 'none'
        });
      } else if (startTime == '') {
        wx.showToast({
          title: '请选择出发日期',
          icon: 'none'
        });
      } else if (endTime == '') {
        wx.showToast({
          title: '请选择返回日期',
          icon: 'none'
        });
      } else {
        ajax.uploadimages(images, function(res) {
          var array = res;
          var newImages = [];
          //console.log(res)
          for (var idx in array) {
            var data = JSON.parse(array[idx]);
            newImages.push(data.data.path)
          }
          //console.log(newImages)
          var jsonData = {
            title: title,
            tags: tags,
            members: members,
            startPlace: startPlace,
            endPlace: endPlace,
            signStartTime: signStartTime,
            signEndTime: signEndTime,
            startTime: startTime,
            endTime: endTime,
            insurance: insurance,
            images: newImages,
            price: manPrice,
            childPrice: childPrice,
            signRule: signRule
          }
          app.globalData.stepData.step1 = jsonData
          wx.navigateTo({
            url: './publishStep2/publishStep2'
          })
        })
      }
    })
  },

  getInformation(uid) {
    var that = this;
    var item = {
      uid: uid
    }
    wx.showLoading();
    ajax.wxRequest('POST', 'User/myHomePage', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          if (res.data.userInfo.is_real == 0) {
            that.setData({
              isReal: true
            });
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
  onLoad: function(options) {
    var that = this;
    this.setData({
      citys: that.data.provinces[0].sub,
      areas: that.data.provinces[0].sub[0].sub,
      endCitys: that.data.provinces[0].sub,
      endAreas: that.data.provinces[0].sub[0].sub,
      nowTime: util.formatTime(new Date()),
      dateStr1: util.formatTime(new Date()),
      dateStr2: util.formatTime(new Date()),
      dateStr3: util.formatTime(new Date()),
      dateStr4: util.formatTime(new Date())
    });
    this.getTags();
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
    if (uid != null) {
      this.getInformation(uid)
    }
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
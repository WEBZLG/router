// pages/home/home.js
const app = getApp()
var ajax = require("../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    showModalStatus: false,
    animationData: '',
    imgUrls: [], //banner
    notice: [], //公告
    travel: [], //线路
    navList: [], //导航菜单
    keyword: '',
    navData:[]
  },

  // 导航
  switchTap(e){
    var id = e.currentTarget.dataset.id;
    app.globalData.switchid=id
    wx.switchTab({
      url: '../router/router',
    })
  },
  // 我要定制行程
  customize(){
    // wx.navigateTo({
    //   url: '../retailLogin/retailLogin',
    // })
    ajax.checkLogin('您未登录无法定制', function () {
      wx.navigateTo({
        url: './customize/customize'
      })
    })
  },
  //查看我的定制
  myRouter(){
    ajax.checkLogin('您未登录无法查看', function () {
    wx.navigateTo({
      url: '../myself/myRouter/myRouter',
    })
    })
  },
  // 搜索
  search(e) {
    var keyword = e.detail.value;
    this.setData({
      keyword: keyword
    })
  },
  searchbtn() {
    var that = this;
    ajax.checkLogin('您未登录无法搜索',function(){
      var keyword = that.data.keyword;
      if (keyword == '') {
        wx.showToast({
          title: '请输入关键字',
          icon: "none"
        })
      } else {
        wx.navigateTo({
          url: './search/search?keyword=' + keyword,
        })
      }
    });
  },
  // 分销代理
  traderApply() {
    ajax.checkLogin('您未登录无法分销代理',function () {
    wx.getStorage({
      key: 'status',
      success: function (res) {
        console.log(res)
        if(res.data==undefined){
          wx.navigateTo({
            url: './traderApply/traderApply',
          });
          return false;
        }

        var status = res.data;
        wx.getStorage({
        key: 'phone',
        success: function (res) {
          var phone = res.data
          if (status == 0) {//已通过
            wx.navigateTo({
              url: './traderApplyLogin/traderApplyLogin?phone=' + phone,
            })
          } else if (status == 1) {//审核中
            wx.navigateTo({
              url: './traderApplyCheck/traderApplyCheck?phone=' + phone,
            })
          } else if (status == 2) {//未通过
            wx.showToast({
              title: '抱歉您的审核未通过！请重新申请',
              icon: "none"
            })
            setTimeout(function () {
              wx.navigateTo({
                url: './traderApply/traderApply',
              })
            }, 2000)
          }
        }
        })
      }
    })

    })


  },
  // 拼团
  findGroup() {
    wx.navigateTo({
      url: './findGroup/findGroup',
    })
  },
  // 找旅行社
  findTravel() {
    wx.navigateTo({
      url: './findTravel/findTravel',
    })
  },
  // 秒杀团
  seckillGroup() {
    wx.navigateTo({
      url: './seckillGroup/seckillGroup',
    })
  },
  // 找领队
  findLeader() {
    wx.navigateTo({
      url: './findLeader/findLeader',
    })
  },
  // 线路详情
  routerDetails(e) {
    var tid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../router/routerDetails/routerDetails?tid=' + tid,
    })
  },
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    console.log(currentStatu)
  },
  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画：x轴不偏移；
    animation.translateX(0).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画：X轴偏移22px，停
      animation.translateX(220).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  // 获取导航类型
  getType(e) {
    var that = this;
    var item = {}
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Index/getCategory', item,
      (res) => {
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          // var navdata = res.data.unshift({ id: 0, name: '热门推荐' })
          that.setData({
            navData: res.data
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
  getHomeData(e) {
    var that = this;
    var item = {
      'page': "",
      'cid': ""
    }
    wx.showLoading({
      mask: 'ture'
    });
    ajax.wxRequest('POST', 'Index/index', item,
      (res) => {
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            imgUrls: res.data.banner,
            notice: res.data.notice,
            travel: res.data.travel
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
    this.setData({
      uid: app.globalData.uid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getHomeData();
    this.getType();
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
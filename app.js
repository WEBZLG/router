//app.js

// !function () {
//   var PageTmp = Page;
//   Page = function (pageConfig) {
//     // 设置全局默认分享
//     pageConfig = Object.assign({
//       onShareAppMessage: function () {
//         return {
//           title: '默认文案',
//           path: '默认分享路径+id',
//           imageUrl: '默认分享图片',
//         };
//       }
//     }, pageConfig);
//     PageTmp(pageConfig);
//   };
// }();
App({
  onLaunch: function () {
    // this.overShare();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
  },
  //重写分享方法
  overShare: function () {
    //监听路由切换
    //间接实现全局设置分享内容
    wx.onAppRoute(function (res) {
      //获取加载的页面
      let pages = getCurrentPages(),
        //获取当前页面的对象
        view = pages[pages.length - 1],
        data;
      if (view) {
        data = view.data;
        //console.log('是否重写分享方法', data.isOverShare);
        if (!data.isOverShare) {
          data.isOverShare = true;
          view.onShareAppMessage = function () {
            //你的分享配置
            return {
              title: '淘淘趣游',
              path: '/pages/home/home'
            };
          }
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    uid:null,
    switchid:null,
    stepData:{},
    successData:null
  }
})
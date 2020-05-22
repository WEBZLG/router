const app = getApp();
var serverPath = "https://travel.liaofankeji.com/web.php/";
var resPath = "https://travel.liaofankeji.com";
/**
 * 封装wx.request请求
 * method： 请求方式
 * url: 请求地址
 * data： 要传递的参数
 * callback： 请求成功回调函数
 * errFun： 请求失败回调函数
 **/
function wxRequest(method, url, data, callback, errFun) {
  wx.request({
    url: serverPath + url,
    method: method,
    data: data,
    header: {
      'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    dataType: 'json',
    success: function(res) {
      callback(res.data);
    },
    fail: function(err) {
      errFun(err);
    }
  })
}
// 单图上传
function uploadimg(imgpath, callback) {
  var that = this;
  wx.uploadFile({
    url: serverPath + 'User/uploadImg', //此处换上你的接口地址
    filePath: imgpath,
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data",
      'accept': 'application/json',
    },
    formData: {
      'uid': app.globalData.uid
    },
    success: function(res) {
      var res = JSON.parse(res.data)
      console.log(res)
      if (res.code == 200) {
        callback(res);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }

    },
    fail: function(res) {
      console.log(res);
      wx.hideLoading();
    },
    complete: function(res) {
      console.log(res);
      wx.hideLoading();
    }
  })
}


// 单图上传分销商
function uploadimgRetail(imgpath, callback) {
  var that = this;
  wx.uploadFile({
    url: serverPath + 'Merchant/uploadImg', //此处换上你的接口地址
    filePath: imgpath,
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data",
      'accept': 'application/json',
    },
    formData: {
      'merchid': app.globalData.uid
    },
    success: function (res) {
      var res = JSON.parse(res.data)
      console.log(res)
      if (res.code == 200) {
        callback(res);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }

    },
    fail: function (res) {
      console.log(res);
      wx.hideLoading();
    },
    complete: function (res) {
      console.log(res);
      wx.hideLoading();
    }
  })
}

// 多图上传
function uploadimages(tempFilePaths,callback){
  var promise = Promise.all(tempFilePaths.map((tempFilePath, index) => {
    return new Promise(function (resolve, reject) {
      console.log(tempFilePath)
      wx.uploadFile({
        url: serverPath + 'User/uploadImg',
        filePath: tempFilePath,
        name: 'file',
        formData: {
          'uid': app.globalData.uid
        },
        success: function (res) {
          resolve(res.data);
        },
        fail: function (err) {
          reject(new Error('failed to upload file'));
        }
      });
    });
  }));
  promise.then(function (results) {
    // console.log(results);
    callback(results)
  }).catch(function (err) {
    console.log(err);
    wx.showToast({
      title: '上传失败，请重试',
      icon:'none'
    })
  });
}

// 检验是否登录
function checkLogin(title,callback) {
  var uid = app.globalData.uid;
  if(uid==null||uid==''){
  console.log(uid)
    wx.showToast({
      title: title,
      icon:"none"
    })
    return false;
  }else{
    callback()
  }
}




module.exports.wxRequest = wxRequest;
module.exports.serverPath = serverPath;
module.exports.resPath = resPath;
module.exports.uploadimg = uploadimg;
module.exports.uploadimages = uploadimages;
module.exports.checkLogin = checkLogin;
module.exports.uploadimgRetail = uploadimgRetail;
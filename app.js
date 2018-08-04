//app.js
var server = require('/utils/server.js')
App({
  onLaunch: function () {
    var that = this;
    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },

  getOpenId: function (cb) {
    wx.login({
      success: function (res) {
        if (res.code) {
          server.getJSON("Index/index", { code: res.code }, function (res) { // 获取appid
            if (res.data.appid) {
              var appid = res.data.appid;
              var appSecret = res.data.appSecret;
              var code = res.data.code;
              wx.request({                  //获取openid、session_key
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + appSecret + '&js_code=' + code + '&grant_type=' + code,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  var openId = res.data.openid;
                  console.log('getOpenid:' + openId);
                  var session_key = res.data.session_key;
                  var app = getApp();
                  var that = app;
                  that.globalData.openid = openId;
                  console.log(that.globalData.openid);
                  that.globalData.session_key = session_key;
                  wx.request({        //校验openid
                    url: 'http://localhost/jielong/index.php/xcx/Index/checkUser',
                    data: {
                      openid: that.globalData.openid
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      if (res.data !== 0) { //服务器端有对应的openid
                        var $session3rd = res.data;
                        wx.setStorageSync('3rd_session', $session3rd);
                      } else {  //服务器端没有对应的openid
                      }
                    }
                  })
                }
              })
            } else {
              console.log(res.data.errmsg);
              wx.showToast({
                title: res.data.errmsg,
                duration: 3000
              });
              return false;
            }
            //验证是否关联openid
            typeof cb == "function" && cb()
          });
          //发起网络请求
        }
      }
    });
  },


  // 获取用户信息
  getSetting: function () {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {  //已授权
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo);
              if (res.userInfo) {
                var app = getApp();
                var that = app;
                that.globalData.userInfo = res.userInfo;
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            },
            fail: function (res) {
              var app = getApp();
              app.getSetting(function () {
                typeof cb == "function" && cb()
              });
            }
          })
        } else {//未授权
          wx.showModal({
            title: '提示',
            content: '应用要获取您的用户信息，是否允许？',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/auth/auth',
                })
              } else if (res.cancel) {
                var app = getApp();
                app.getSetting_Qz(function () {
                  typeof cb == "function" && cb()
                });
              }
            }
          })
        }
      },
    })
  },

  //强制授权
  getSetting_Qz: function (cb) {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '小程序需要获取用户信息权限,否则无法正常使用,点击确定前往设置.',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/auth/auth',
          })
        } else if (res.cancel) {
          console.log('您已取消')
        }
      }
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            fail: function () {
              var app = getApp();
              app.getSetting(function () {
                typeof cb == "function" && cb()
              });
            }
          })
        },
      })
    }
  },

  register: function (cb) {
    var app = this;
    this.getUserInfo(function () {
      console.log('授权成功');
      var openId = app.globalData.openid;
      var userInfo = app.globalData.userInfo;
      var country = userInfo.country;
      var city = userInfo.city;
      var gender = userInfo.gender;
      var nick_name = userInfo.nickName;
      var province = userInfo.province;
      var avatarUrl = userInfo.avatarUrl;
      var up_uid = app.globalData.up_uid;
      //console.log(openId);
      server.getJSON('/User/register?open_id=' + openId + "&country=" + country + "&gender=" + gender + "&nick_name=" + nick_name + "&province=" + province + "&city=" + city + "&head_pic=" + avatarUrl + "&up_uid=" + up_uid, function (res) {
        app.globalData.userInfo = res.data
        console.log(res.data);
        typeof cb == "function" && cb()
      });

    })
  },

  globalData: ({
    'userInfo': null,
    'openid': null,
    'session_key': null,
    'confirmNum': 0,
    'ztData': [],
    'confirmOcNum': 0,
    'ocData': [],
    'subGoodsInfo': {},
    'gp': [],
    'orderNumber':''
  })
})
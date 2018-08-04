// pages/uc/ziliao/ziliao.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    userData: {
      'userName': '请输入真实姓名', 
      'uphone': '请输入手机号码', 
      'uwxnumber':'请输入微信号',
      'uemail':'请输入邮箱地址',
      'ugetaddress':'请输入您的详细收货地址'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({openId:app.globalData.openid});
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/User/loadUserinfo',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          userData:res.data.data
        });
        var udata = res.data.data;
        that.setData({
          userData:udata
        })
      }
    })
  },

  get_phone: function(e){
    var uphone = 'userData.uphone'
    this.setData({
      [uphone]: e.detail.value
    })
  },

  get_uname: function (e) {
    var userName = 'userData.userName'
    this.setData({
      [userName]: e.detail.value
    })
  },

  get_uemail: function(e){
    var uemail = 'userData.uemail'
    this.setData({
      [uemail]: e.detail.value
    })
  },

  get_uwxnumber: function (e) {
    var uwxnumber = 'userData.uwxnumber'
    this.setData({
      [uwxnumber]: e.detail.value
    })
  },

  get_ushaddress: function(e){
    var ugetaddress = 'userData.ugetaddress'
    this.setData({
      [ugetaddress]: e.detail.value
    })
  },
  /**
   * 保存收货地址表单数据
   */
  shSubmit: function(e){
     var openid = e.detail.value.openid;
     var uname =  e.detail.value.uname;
     var uphone = e.detail.value.uphone;
     var uwxnumber = e.detail.value.uwxnumber;
     var uemail = e.detail.value.uemail;
     var ushaddress = e.detail.value.ushaddress;
     wx.request({
      url: 'http://localhost/jielong/index.php/xcx/User/adduserinfo', 
      data: {
        openid:openid,
        uname:uname,
        uphone:uphone,
        uwxnumber:uwxnumber,
        uemail:uemail,
        ushaddress:ushaddress
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.status){
          wx.showToast({
            title: '个人资料保存成功！',
            icon: 'success',
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '个人资料保存失败！',
            icon: 'none',
          })
        }
      }
    })
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
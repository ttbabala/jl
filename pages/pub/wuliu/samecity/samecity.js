// pages/pub/wuliu/samecity/samecity.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selStTime:true,
    st_time:'开始时间',
    ed_time:'截止时间',
    showStartTime:false,
    showEndTime:false,
    ishaveData:false,
    pldes:'请以文字描述您的配送范围，如全市范围内、全区范围内、某小区周边五公里范围内等',
    scData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSamecityData();
  },

  //获取服务器端配送数据
  getSamecityData:function(){
    var openid = app.globalData.openid;
    var that = this;
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/Samecity/loadSamecity/', //向服务器提交配送信息
      data: {
        openid: openid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.statsus == 1){
          that.setData({
            ishavaData: true,
            scData:res.data.data
          })
        }else{
          that.setData({
            ishavaData: false
          })
        }
      }
    })
  },

  getStartTime: function(){
    this.setData({
      selStTime: false,
      showStartTime:true,
      showEndTime:false
    })
  },

  getEndTime: function(){
    this.setData({
      showEndTime: true,
      showStartTime: false
    })
  },

  startTimeChange:function(e){
    var startTime = 'scData[0].startTime'
    this.setData({
      [startTime]:e.detail.value,
      st_time:e.detail.value
    })
  },

  endTimeChange:function(e){
    var endTime = 'scData[0].endTime'
    this.setData({
      [endTime]:e.detail.value,
      ed_time: e.detail.value
    })
  },

  DesinfoChange:function(e){
    var des = 'scData[0].des'
    this.setData({
      [des]:e.detail.value
    })
  },
  
  //添加同城配送信息
  formAddSamecitySubmit:function(e){
      var that = this;
      var warn = "";//弹框时提示的内容
      var flag = true;//判断信息输入是否完整
      if(e.detail.value.samecityInfo == ''){
        warn = "请填写配送范围";
      }else if(e.detail.value.startTime == '开始时间'){
        warn = "请选择配送开始时间";
      }else if(e.detail.value.endTime == '截止时间'){
        warn = "请选择配送结束时间";
      }else{
        flag = false;
        var openid = app.globalData.openid;
        if(openid == ''){
          console.log('没有获取到用户openid');
        }else{
          wx.request({
            url: 'http://localhost/jielong/index.php/xcx/Samecity/addSamecity/', //向服务器提交配送信息
            data: {
              openid:openid,
              samecityInfo:e.detail.value.samecityInfo,   //配送范围
              startTime:e.detail.value.startTime,     //配送开始时间
              endTime:e.detail.value.endTime          //配送截止时间
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              var notice = '';
              if(res.data.statsus == 1){
                that.setData({
                  ishavaData: true        //无论为更新还是插入，服务器端都有数据
                })
                if(res.data.isup == 1){  //isup判定为更新或是插入操作
                  notice = '配送范围数据更新成功！'
                }else{
                  notice = '配送范围数据保存成功！'
                }
                wx.showModal({
                  title: '数据',
                  showCancel: false,
                  content: notice
                })
              }else{
                console.log(res.data.msg)
              }
            }
          })
        }
      }
      if (flag == true) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: warn
        })
      }
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
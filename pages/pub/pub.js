// pages/pub/pub.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rhpub:'微信群团购接龙只需要4步,就能成功发布哦,操作简单效果看得见。第一步,打开微信,在发现栏目中找到小程序。第二步,搜索小程序“群团购接龙”点击进去第三步,点击发布进入团购接龙发布页面并填写详细信息，点击发布。微信群团购接龙只需要4步,就能成功发布哦,操作简单效果看得见。第一步,打开微信,在发现栏目中找到小程序。第二步,搜索小程序“群团购接龙”点击进去第三步,点击发布进入团购接龙发布页面并填写详细信息，点击发布。微信群团购接龙只需要4步,就能成功发布哦,操作简单效果看得见。第一步,打开微信,在发现栏目中找到小程序。'
  },
  /*发布接龙*/
  navinow:function(e){
    wx.navigateTo({
      url: './pubnow/pubnow',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

 
})
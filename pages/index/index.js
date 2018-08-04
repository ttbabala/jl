//index.js
//获取应用实例
const app = getApp()

Page({
  data: {   
    userInfo: {},
    showModal: false,
    hotgoods: true,
    fjgoods: false,
    likegoods: false,
    hasUserInfo: false,
    shaixuan: true,
    clickinfo: '收起筛选框',
    clickinfoImg: '/images/shouqi.png',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    searchValue: '',
    items: [
      { name: 'timeMore', value: '发布时间', checked: 'true' },
      { name: 'guanzhuMore', value: '关注最多'},
      { name: 'addressMore', value: '距离最近' },
      { name: 'liulanMore', value: '浏览最多' }
    ],
    goods: [],
    mz_notice: "第一条\n用户以各种方式使用团购接龙服务和数据（包括但不限于发表、宣传介绍、转载、浏览及利用团购接龙或团购接龙用户发布内容）的过程中，不得以任何方式利用团购接龙直接或间接从事违反中国法律法规，以及社会公德的行为。\n用户应当恪守下述承诺：发布、转载或提供的内容符合中国法律法规、社会公德；不得干扰、损害和侵犯果壳网的各种合法权利与利益；不得干扰、损害和侵犯其他果壳网用户的各种合法权利与利益；\n团购接龙有权对违反上述承诺的内容予以删除。"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  //事件处理函数
  navgoods: function(e) {
    wx.navigateTo({
      url: '../goods/goods?gid=' + e.currentTarget.dataset.gid
    })
  },

  navsearch: function () {
    wx.navigateTo({
      url: 'searchs/searchs'
    })
  },
 
  //事件处理函数
  navpersonal: function() {
    wx.navigateTo({
      url: './personal/personal'
    })
  },


  //事件处理函数
  navsearchs: function () {
    wx.navigateTo({
      url: './searchs/searchs'
    })
  },

  //热门推荐响应事件
  seltab_hotgoods: function(){
    this.setData({
      hotgoods: true,
      fjgoods: false,
      likegoods: false
    })
  },
  //附近接龙响应事件
  seltab_fjgoods: function(){
    this.setData({
      fjgoods: true,
      hotgoods: false,
      likegoods: false
    })
  },
  //我关注的响应事件
  seltab_likegoods: function(){
    this.setData({
      likegoods: true,
      hotgoods: false,
      fjgoods: false
    })
  },
  //个人主页跳转
  navpersonal: function () {
    wx.navigateTo({
      url: '../personal/personal'
    })
  },
  //onload事件
  onLoad: function () {
    app.getSetting();
    app.getOpenId();
    app.register();
    this.mianzeNotice();
    this.getGoods();
  },

  //获取接龙信息
  getGoods: function(){
    var that = this;
    var gid = '';
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/Goods/getGoods', 
      data: {
        gid:gid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
            goods:res.data.data
        })
      }
    })
  },
  
  //免责声明
  mianzeNotice:function(){
    this.setData({
      showModal: true
    })
  },

  /**
 * 隐藏模态对话框
 */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
  * 对话框取消按钮点击事件
  */
  onCancel: function () {
    this.hideModal();
  },
  /**
  * 对话框确认按钮点击事件
  */
  onConfirm: function () {
    this.hideModal();
  },

  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },

  /* 筛选隐藏 */
  hiddenShaiXuan:function(e){
    if(this.data.shaixuan == true){
      this.setData({
        shaixuan: false,
        clickinfo: '放下筛选框',
        clickinfoImg: '/images/fangxia.png',
      })
    }else{
      this.setData({
        shaixuan: true,
        clickinfo: '收起筛选框',
        clickinfoImg: '/images/shouqi.png',
      })
    }

  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

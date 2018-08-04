// pages/goods/goods.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flagqr: true,
    flagzf: true,
    amount: 0,
    index: 0,
    goods_num: 1,
    goods:[],
    buygoodsPop:false,
    totalPrice:0,
    shaddress:'',
    showOrderPop:false,
    tp:0,
    uiData: {
      'userName': '请输入您的姓名',
      'uphone': '请输入您的手机号码',
      'ugetaddress': '请输入您的详细收货地址',
      // 'ubeizhu': '请输入其它的备注信息'
    }
  },

  get_phone: function (e) {
    var uphone = 'uiData.uphone'
    this.setData({
      [uphone]: e.detail.value
    })
  },

  get_uname: function (e) {
    var userName = 'uiData.userName'
    this.setData({
      [userName]: e.detail.value
    })
  },

  get_ugeaddress: function (e) {
    var ugetaddress = 'uiData.ugetaddress'
    this.setData({
      [ugetaddress]: e.detail.value
    })
  },

  // get_ubeizhu: function (e) {
  //   var ubeizhu = 'uiData.ubeizhu'
  //   this.setData({
  //     [ubeizhu]: e.detail.value
  //   })
  // },
  /**
   * 弹出小程序二维码层
  */
  popqrcode: function(e){
    this.setData({
      flagqr: false,
      flagzf: true
    })
  },
  /**
   * 弹出转发层
   */
  popzhuanfa: function(e){
    this.setData({
      flagzf: false,
      flagqr: true
    })
  },

  /**
   * 关闭二维码层
   */
  closepopqr: function(e){
    this.setData({
      flagqr: true,
      flagzf: true
    })
  },

/**
* 隐藏模态对话框
*/
  hideModal: function () {
    this.setData({
      showOrderPop: false
    });
  },

  /**
  * 对话框取消按钮点击事件
  */
  onCancel: function () {
    wx.showToast({
      title: '您取消了购买',
    })
    this.hideModal();
  },

  //立即购买
  navibuy: function(e){
    var that = this;
    var openid = app.globalData.openid;
    var gid = e.currentTarget.dataset.gid;  //获取商品id
    //var gdata = e.currentTarget.dateset.gdata; //获取商品信息数组
    var gnum = e.currentTarget.dataset.num; //获取所购买的商品数量
    var gprice = e.currentTarget.dataset.price; //获取商品单价
    var totalprice = gprice * gnum//获取商品总价 数量*单价
    var flagshaddress = 1;
    //获取收货地址
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/Goods/getshaddress',
      data: {
        openid: openid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        var ushdata = {
          'userName': res.data.data[0].uname,
          'uphone': res.data.data[0].uphone,
          'ugetaddress': res.data.data[0].ugetaddress
        }
        that.setData({
          uiData:ushdata
        })
      }
    })
    //弹出订单确认弹窗
    that.setData({
      tp:totalprice,
      showOrderPop:true
    })
  },

  /**
   * 生成订单并支付
   */
  createOrder:function(e){
    var that = this;
    var openid = app.globalData.openid;
    var gid = e.currentTarget.dataset.gid;  //获取商品id
    var gnum = e.currentTarget.dataset.num; //获取所购买的商品数量
    var gprice = e.currentTarget.dataset.price; //获取商品单价
    var totalprice = e.currentTarget.dataset.totalprice; //商品总价
    var uname = e.currentTarget.dataset.uname   
    var uphone = e.currentTarget.dataset.uphone;
    var shaddress = e.currentTarget.dataset.shaddress;
    //向服务器发送订单信息
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/Order/createOrder',
      data: {
        useropenid: openid,
        gid:gid,
        gnum:gnum,
        gprice:gprice,
        totalprice:totalprice,
        uname:uname,
        uphone:uphone,
        shaddress:shaddress
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var that_1st = that;
        var openid = res.data.data.uid;             //用户openid
        var gid = res.data.data.gid;                 //商品ID
        var orderNumber = res.data.data.order_number; //订单号
        var totalprice = res.data.data.pay_price;   //商品总价
        app.globalData.orderNumber = orderNumber;   //用全局变量存储订单编号
        if (res.data.statsus == 1){ //如果服务器端创建订单成功
          wx.request({
            url: 'https://nxbuilding.com/wxpay/pay.php/',  //生成预支付订单
            data: {
              useropenid: openid,
              gid: gid,
              totalprice: totalprice,
              orderNumber: orderNumber
            },
            method: 'POST', 
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 此种方式服务器端可用$_POST方式接收
            },
            success: function (res) {
              var that_2nd = that_1st;
              console.log(res.data);  //打印预支付订单反馈内容
       
          /*{appId: "wxe41c158180274a2c", nonceStr: "rrgz8612gtxwsa1q67lru9fpv3yoqavt", package: "prepay_id=wx04174007693573a3cecb36e91144620117", signType: "HMAC-SHA256", timeStamp: "1533375607", …} */
              //隐藏订单弹出页面
              that_2nd.setData({
                showOrderPop: false
              })
              //发起微信支付
              wx.requestPayment({   
                'timeStamp': res.data.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
                'nonceStr': res.data.nonceStr,  //随机字符串，长度为32个字符以下。
                'package': res.data.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
                'signType': res.data.signType, //签名算法，暂支持 MD5
                'paySign': res.data.paySign,   //签名
                'success': function (res) {  //支付成功
                  wx.showModal({           //弹出支付成功模态框
                    title: '',
                    showCancel:false,     //不显示Cancel按钮
                    content: '支付成功',
                    success: function(res){
                      if(res.confirm) {   //用户点击了确认按钮
                        var orderNumber = app.globalData.orderNumber; //从全局变量中获取订单号
                        var orderPayTime = Date.parse(new Date()); //获取UNINX时间戳
                        wx.request({      //变更订单付款状态为已付款
                          url: 'http://localhost/jielong/index.php/xcx/Order/changeOrderPay', 
                          data: {
                            orderNumber:orderNumber, //订单号
                            orderPayTime:orderPayTime //时间戳
                          },
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success: function (res) {
                            console.log(res.data)
                          }
                        })
                      }
                    }
                  })
                },
                'fail': function (res) {
                  console.log('支付失败');
                }
              })
            }
          })
        }      
      }
    })
  },

  /*
   * 生命周期函数--监听页面加载
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '团购接龙',
      path: '/page/user?id=123'
    }
  },

  //绑定购物车文本框数量
  bindMinus: function (e) {
    var num = this.data.goods_num;
    var price = e.currentTarget.dataset.price
    if (num > 1) {
      num--;
    }
    var totalprice = price * num;

    this.setData({ goods_num: num,totalprice: totalprice});
  },
  bindManual: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = e.detail.value;
    this.setData({ goods_num: num });
  },
  bindPlus: function (e) {
    var num = this.data.goods_num;
    var price = e.currentTarget.dataset.price
    num++;
    var totalprice = price * num;

    this.setData({ goods_num: num,totalprice: totalprice });
  },

  /* 跳转到首页 */
  navihome: function(e){
    wx.navigateTo({
      url: '../index/index'
    })
  },

  /* 跳转到发布接龙页面 */
  navipub: function (e) {
    wx.navigateTo({
      url: '../pub/pubnow/pubnow'
    })
  },

  onLoad: function (options) {
    this.getGoods(options.gid);   
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    }); 
  },

  //获取单条接龙信息
  getGoods: function (gid) {
    var that = this;
    var gid = gid;
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/Goods/getGoods',
      data: {
        gid: gid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          goods: res.data.data
        })
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
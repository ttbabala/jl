// pages/pub/pubnow/pubnow.js
var app = new getApp();
var server = require('../../../utils/server.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    showprice: false,
    showdate: false,
    showphoto: false,
    showziti: false,
    showsamecity:false,
    showothercity:false,
    hpHeight:'380rpx',
    date: '2018-10-01',
    //popflag:true,
    addressName: '定位位置',
    addressInfo: '详细地址',
    latitude:'',
    longitude:'',
    index: 0,
    catarray:[],
    catRangeArray:[],
    /*第一次提交接龙信息 */
    goodsZhuti: '',
    goodsInfo: '',
    goodsPhoto:[],
    startPrice:0,
    date:'2018-08-01',
    wuliu_ziti: false,
    wuliu_samecity: false,
    wuliu_othercity: false,
    havaztConfig:false,
    havaocConfig:false,
    ocsubinfo:'',
    ztsubinfo:'',
    gp:[],
    openId:''
  },

  /* 获取主题值*/ 
  get_zhuti:function(e){
    this.setData({
      goodsZhuti:e.detail.value
    })
  },

  /* 获取接龙描述*/
  get_goodsinfo: function(e){
    this.setData({
      goodsInfo:e.detail.value
    })
  },

  /* 获取起购价格 */
  get_startprice: function(e){
    this.setData({
      startPrice:e.detail.value
    })
  },

  /* 获取截止时间*/
  get_setdate: function(e){
    this.setData({
      date:e.detail.value
    })
  },

  /*验证第一次表单内容*/
  nextStep:function(e){
    // const that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    //判断的顺序依次是：接龙主题-接龙介绍-接龙地址
    if (this.data.goodsZhuti == "") {
      warn = "请填写接龙主题";
    } else if (this.data.goodsInfo == "") {
      warn = "请填写接龙介绍";
    } else if (this.data.addressName == "定位位置") {
      warn = "请选择您的接龙地址"
    } else {
      flag = false;//若必要信息都填写，则不用弹框
      this.nextstep();
    }
    //如果信息填写不完整，弹出输入框
    if (flag == true) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: warn
      })
    }
  },

  /**
   * 选项卡
   */
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  openmap: function(e){
    var that = this;
    wx.getLocation({
      type: 'wgs84ll', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.chooseLocation({
          success: function(res){
          var address_name = res.name;
          var address_info = res.address;
          that.setData({ 
            latitude: res.latitude,
            longitude: res.longitude,        
            addressName: address_name,
            addressInfo: address_info
          })
         
          // wx.request({
          //     url: 'https://api.map.baidu.com/geocoder/v2/?ak=IBMY12ukM2yorciPUoyKmlwy6io9IWcU&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
          //     data: {},
          //     header: {
          //       'Content-Type': 'application/json'
          //     },
          //     success: function (res) {
          //       var prvince = res.data.result.addressComponent.province;
          //       var district = res.data.result.addressComponent.district;
          //       var city = res.data.result.addressComponent.city;
          //       that.setData({
          //         prvince:prvince
          //       })
          //     }
          //   })
          },
          fail: function () {
            console.log(res);
          },
          complete: function () {
            // complete
          }
        })
      }
    }) 
  },
  choosephoto: function(e){
    var that = this
    wx.chooseImage({
      count: 8, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length <= 4 && tempFilePaths.length !== 0){
          var hpHeight = '190rpx';
          var showphoto = true;

        }else if (tempFilePaths.length > 4){
          var hpHeight = '380rpx';
          var showphoto = true;
        }else if(tempFilePaths.length == 0){
          var hpHeight = 'auto';
          var showphoto = false;
        }
        that.setData({
          goodsPhoto: tempFilePaths,
          showphoto: showphoto,
          hpHeight: hpHeight  
        })
        console.log(tempFilePaths);
        //启动上传等待中...  
        // wx.showToast({
        //   title: '正在上传...',
        //   icon: 'loading',
        //   mask: true,
        //   duration: 10000
        // })
        //var uploadImgCount = 0;
        // for (var i = 0, h = tempFilePaths.length; i < h; i++) {
        //   wx.uploadFile({
        //     url: util.getClientSetting().domainName + '/home/uploadfilenew',
        //     filePath: tempFilePaths[i],
        //     name: 'uploadfile_ant',
        //     formData: {
        //       'imgIndex': i
        //     },
        //     header: {
        //       "Content-Type": "multipart/form-data"
        //     },
        //     success: function (res) {
        //       uploadImgCount++;
        //       var data = JSON.parse(res.data);
        //       //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }  
        //       var productInfo = that.data.productInfo;
        //       if (productInfo.bannerInfo == null) {
        //         productInfo.bannerInfo = [];
        //       }
        //       productInfo.bannerInfo.push({
        //         "catalog": data.Catalog,
        //         "fileName": data.FileName,
        //         "url": data.Url
        //       });
        //       that.setData({
        //         productInfo: productInfo
        //       });

        //       //如果是最后一张,则隐藏等待中  
        //       if (uploadImgCount == tempFilePaths.length) {
        //         wx.hideToast();
        //       }
        //     },
        //     fail: function (res) {
        //       wx.hideToast();
        //       wx.showModal({
        //         title: '错误提示',
        //         content: '上传图片失败',
        //         showCancel: false,
        //         success: function (res) { }
        //       })
        //     }
        //   });
        // }    
      }
    })
  },
 
  /*图片预览 */
  previewImg:function(e){
    var index = e.currentTarget.dataset.index;
    //所有图片
    var goodsPhoto = this.data.goodsPhoto;
    wx.previewImage({
      //当前显示图片
      current: goodsPhoto[index],
      //所有图片
      urls: goodsPhoto
    })
  },

  // 删除图片
  deleteImg: function (e) {
    var goodsPhoto = this.data.goodsPhoto;
    var index = e.currentTarget.dataset.index;
    goodsPhoto.splice(index, 1);
    /*动态控制图片显示栏的高度*/
    if (goodsPhoto.length <= 4 && goodsPhoto.length !== 0) {
      var hpHeight = '190rpx';
      var showphoto = true;

    } else if (goodsPhoto.length > 4) {
      var hpHeight = '380rpx';
      var showphoto = true;
    } else if (goodsPhoto.length == 0) {
      var hpHeight = 'auto';
      var showphoto = false;
    }
    this.setData({
      goodsPhoto: goodsPhoto,
      showphoto: showphoto,
      hpHeight: hpHeight
    });
  }, 

  setprice: function(e){
    this.setData({
      showprice: e.detail.value
    })
  },

  setdate: function(e){
    this.setData({
      showdate: e.detail.value
    })
  },

  changeDate: function(e){
    this.setData({
      date: e.detail.value
    })
  },
  /* 设置自提点*/
  setziti: function(e){
    this.setData({
      showziti: e.detail.value,
      wuliu_ziti:e.detail.value
    })
  },
  
  setzitiNow: function(e){
    wx.navigateTo({
      url: '../wuliu/ziti/ziti',
    })
  },

  /*设置同城物流*/
  setSameCity: function(e){
    this.setData({
      showsamecity: e.detail.value,
      wuliu_samecity: e.detail.value
    })
  },

  setSameCityNow: function (e) {
    wx.navigateTo({
      url: '../wuliu/samecity/samecity',
    })
  },

  /*设置异地物流*/
  setOtherCity: function(e){
    this.setData({
      showothercity: e.detail.value,
      wuliu_othercity: e.detail.value
    })
  },

  setOtherCityNow: function(e){
    wx.navigateTo({
      url: '../wuliu/othercity/othercity',
    })
  },
  /**
 * 弹出层函数
 */
  //出现
  show: function () {
    this.setData({ popflag: false })
  },
  //消失
  hide: function () {
    this.setData({ popflag: true })
  },
  /**
   * 跳转到下一步
   */
  nextstep: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },

  /*
  * 接龙发布表单提交按钮点击事件
  */
  goodsSubmit: function(e){
    //图片上传
    var that = this;
    var goodsPhoto = that.data.goodsPhoto;
    var openid = app.globalData.openid;
    var uploadImgCount = 0;
    var gpData = new Array();
    if( goodsPhoto.length > 0 ){  //如果有接龙图片
      var gp = app.globalData.gp;
      for (var i = 0, h = goodsPhoto.length; i < h; i++) {
        wx.uploadFile({
          url: 'http://localhost/jielong/index.php/xcx/Image/upload',
          filePath: goodsPhoto[i],
          name: 'uploadfile',
          formData: {
            'imgIndex': i,
            'openId': openid
          },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            uploadImgCount++;
            var gpdata = JSON.parse(res.data);
            gp.push({
              'src':gpdata.src,
            },)
            if(app.globalData.gp.length != 0){
              app.globalData.gp = gp;
            }
            //如果是最后一张,则隐藏等待中  
            if (uploadImgCount == goodsPhoto.length) {
              wx.hideToast();
            }
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        });
      } 
    }

    wx.showModal({
      content: '您现在确定要发布接龙吗？',
      showCancel: true,
      success: function (res) { 
        if (res.confirm) {
          wx.request({
            url: 'http://localhost/jielong/index.php/xcx/Goods/addGoods', 
            data: {
              openid : e.detail.value.openid,
              goods_zhuti : e.detail.value.goodsZhuti,  //接龙主题
              goods_des : e.detail.value.goodsInfo, //接龙描述
              goods_photo : app.globalData.gp, //接龙图片
              goods_addressName : e.detail.value.addressName, //地址名称
              goods_addressInfo : e.detail.value.addressInfo, //详细地址
              goods_startPrice : e.detail.value.startPrice, //起购价
              goods_endTime : e.detail.value.endTime,     //截止时间
              goods_ziti: e.detail.value.ztSubInfo,  //自提id
              goods_oc: e.detail.value.ocSubInfo, //异地物流id
              goods_name: e.detail.value.goodsName, //接龙商品名称
              goods_cat: e.detail.value.goodsCat, //接龙商品分类
              goods_Rules: e.detail.value.goodsRules, //商品规格
              goods_Price : e.detail.value.goodsPrice, //商品价格
              goods_Num : e.detail.value.goodsNums    //商品库存
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              app.globalData.gp = []; //数组初始化，删除之前接龙数据
              if (res.data.statsus == 1){
                wx.showToast({
                  title: '接龙数据发布成功！',
                })
              }else{
                wx.showToast({
                  title: '接龙数据与远端服务器连接有误，请稍后重试！',
                })
              }
            }
          })
          // console.log('接龙主题:' + e.detail.value.goodsZhuti);
          // console.log('接龙描述:' + e.detail.value.goodsInfo);
          // console.log('接龙图片:' + app.globalData.gp);
          // console.log('接龙位置:' + e.detail.value.addressName);
          // console.log('接龙位置:' + e.detail.value.addressInfo);
          // console.log('起购价:' + e.detail.value.startPrice);
          // console.log('截止时间:' + e.detail.value.endtime);
          // console.log('自提设置:' + e.detail.value.ztSubInfo);
          // console.log('异地物流设置:' + e.detail.value.ocSubInfo);
          // console.log('商品名称:' + e.detail.value.goodsName);
          // console.log('商品分类:' + e.detail.value.goodsCat);
          // console.log('商品规格:' + e.detail.value.goodsRules);
          // console.log('商品价格:' + e.detail.value.goodsPrice);
          // console.log('商品库存:' + e.detail.value.goodsNums);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goodsJson = wx.getStorageSync('pubgoods');
    this.setData({
      openId:app.globalData.openid
    })
    //判断自提信息是否配置
    if(goodsJson.zt != ''){
      this.setData({
        havaztConfig:true,
        ztsubinfo:goodsJson.zt
      })
    }else{
      this.setData({
        havaztConfig: false
      })
    }
    //判断异地物流信息是否配置
    if (goodsJson.oc != '') {
      this.setData({
        havaocConfig: true,
        ocsubinfo: goodsJson.oc
      })
    } else {
      this.setData({
        havaocConfig: false
      })
    }

    //载入服务器端接龙分类
    var that = this;
    var catrange = [];
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/cat/loadcat', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        for(var i=0;i<res.data.data.length;i++){
            catrange[i] = res.data.data[i].catname; //为picker的range属性赋值
        }
        that.setData({
          catarray: res.data.data,
          catRangeArray: catrange
        })
        console.log(catrange);
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
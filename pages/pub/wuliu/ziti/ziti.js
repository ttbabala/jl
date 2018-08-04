// pages/pub/wuliu/ziti/ziti.js
var app = new getApp();
var server = require('../../../../utils/server.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    latitude: '',
    longitude: '',
    addressName: '定位',
    addressInfo: '',
    city: '',
    zitiInfo:'',
    noziti:true,
    zitilist:false,
    zitiArray:[],
    selvalue:0,
    ztSingle:[],
    showZtPop:false,
    ishavaData:false,
    ztData:[],
    changePlace: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.havaztData();
  },

  //载入数据表中自提数据
  havaztData: function(){
    var that = this;
    wx.request({
      url: 'http://localhost/jielong/index.php/xcx/ziti/loadztData/',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var ztDataNum = res.data.data.length; //服务器端数据表中自提数据条数
        if (ztDataNum > 0) {
          var ishave = true;
        } else {
          var ishave = false;
        }
        var goodsData = wx.getStorageSync('pubgoods');
        if(goodsData.zt != ''){
          for(var i=0; i<res.data.data.length; i++){
              if(goodsData.zt == res.data.data[i].id){
                  res.data.data[i].checked = true
              }else{
                  res.data.data[i].checked = false
              }
          }
        }else{
          console.log('还没有选择自提信息');
        }
        that.setData({
          ishavaData: ishave,
          ztData: res.data.data,  //数据表中对应用户的所有自提信息
          noziti: false
        })
      }
    })
  },

  showDialogBtn: function () {
    this.setData({
        showModal:true
      })
  },

  get_zitiinfo: function(e){
    var info = 'ztSingle[1].info'
    this.setData({
        [info]:e.detail.value,
        zitiInfo:e.detail.value
    })
  },

  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () {
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
  * 隐藏模态对话框
  */
  hideZtPop: function () {
    this.setData({
      showZtPop: false
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
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (that.data.zitiInfo == '') {
      warn = "请填写自提详细地址";
    }else if (that.data.addressName == '定位') {
      warn = "请选择定位";
    }else {
      flag = false;//若必要信息都填写，则不用弹框      
      that.setData({
        noziti: false //不显示底部背景
      })
      /* 设置全局变量存储自提信息*/
      app.globalData.confirmNum++;
      var i = app.globalData.confirmNum;
      var zitiData, ztSingleList = new Array();
      zitiData = app.globalData.ztData;
      if (i > 0 && i < 6) {
        var random = Math.random() * 10;
        var id = random.toString().substr(2);
        ztSingleList[i] = [{ 'id':id },{ 'info': that.data.zitiInfo }, { 'city': that.data.city }, { 'addressName': that.data.addressName }, {'checked': false}];
        zitiData.push(ztSingleList[i]);
        app.globalData.ztData = zitiData;
        that.setData({
          zitiArray: zitiData
        })
        wx.showModal({
          content: '设置成功！是否要将此次添加的自提地址同步到默认设置中去，以便下次使用。',
          success: function (res) {
            if (res.confirm) {
              try {
                //把自提信息加入缓存
                wx.setStorageSync('ztinfo', JSON.stringify(that.data.zitiArray));
                var ztData = that.data.zitiArray;
                var session3rd = wx.getStorageSync('3rd_session');
                wx.request({
                  url: 'http://localhost/jielong/index.php/xcx/ziti/addziti/', 
                  data: {
                    ztData: ztData,   //自提信息
                    openid: app.globalData.openid
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    var ztDataNum = res.data.data.length; //服务器端数据表中自提数据条数
                    if(ztDataNum > 0){
                      var ishave = true;
                    }else{
                      var ishave = false;
                    }
                    that.setData({
                      ishavaData: ishave,
                      ztData: res.data.data
                    })
                    console.log(res.data.data)
                  }
                })
              } catch (e) {
                console.log(e);
              }
            } else if (res.cancel) {
              console.log('保存失败');
            }
          }
        })
      } else {
        console.log('添加的自提地址数目不能大于5条');
        wx.showToast({
          title: '添加的自提地址数目不能大于5条',
          icon:'none',
          duration: 2000
        })
      }
    }
    this.hideModal();
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
 *取消编辑自提地址事件
 */
  editCancel: function () {
    this.hideModal();
  },

  /**
  *保存编辑自提地址事件
  */
  editConfirm: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (that.data.ztSingle[1].info == '') {
      warn = "请填写自提详细地址";
    }else {
      flag = false;//若必要信息都填写，则不用弹框      
      that.setData({
        noziti: false //不显示底部背景
      })
      var id = e.currentTarget.dataset.id;
      // var ztinfo = wx.getStorageSync('ztinfo');
      // var ztArray = JSON.parse(ztinfo);
      // for (var i = 0; i < ztArray.length; i++) {
      //   if (id == ztArray[i][0].id) {
      //     ztArray[i][1].info = that.data.zitiInfo;
      //     ztArray[i][2].city = that.data.city;
      //     ztArray[i][3].addressName = that.data.addressName
      //     that.setData({
      //       ztSingle: ztArray[i],
      //     })
      //   }
      // }
      //向服务器端发送修改后的自提信息
      wx.request({
        url: 'http://localhost/jielong/index.php/xcx/ziti/editziti/',
        data: {
          openid: app.globalData.openid,
          ztid: id,
          ztinfo: that.data.ztSingle[1].info,
          ztcity: that.data.ztSingle[2].city,
          addressName: that.data.ztSingle[3].addressName,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            ztData: res.data.data
          })
        }
      })
      wx.showModal({
          content: '设置成功！是否要将此次编辑的自提地址同步到默认设置中去，以便下次使用。',
          success: function (res) {
            if (res.confirm) {
              console.log('保存成功');
            } else if (res.cancel) {
              console.log('保存失败');
            }
          }
        })
    }
    this.hideZtPop();
    //如果信息填写不完整，弹出输入框
    if (flag == true) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: warn
      })
    }
  },

  listenerRadioGroup:function(e){
    this.setData({
      selvalue:e.detail.value
    })
  },

  /*单选框点击事件*/
  selRadio:function(){
    var items = this.data.ztData;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id == this.data.selvalue) {
        for (var j = 0; j < items.length; j++) {
          if (items[j].checked && j != i) {
            items[j].checked = false;
          }
        }
        items[i].checked = !(items[i].checked);
      }
    }
    this.setData({
      ztData: items
    });
  },

  /*打开地图选择自提点 */
  openmap: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.chooseLocation(latitude,longitude)
      }
    })
  },

  chooseLocation: function (latitude, longitude){
    var that = this;
    wx.chooseLocation({
      success: function (cl) {
        //获取城市
        that.getCity(cl.longitude, cl.latitude);
        that.setData({
          latitude: cl.latitude,
          longitude: cl.longitude,
          addressName: cl.name,
          addressInfo: cl.address,
        })
        var city = 'ztSingle[2].city';
        var addressName = 'ztSingle[3].addressName';
        //把单条自提信息内的地址信息更正为最新
        that.setData({
          [city]: that.data.city,
          [addressName]: that.data.addressName
        })
      },
      fail: function () {
        console.log(res);
      },
      complete: function () {
        // complete
      }
    })
  },

  getCity: function(longitude,latitude){
      var that = this;
      wx.request({
        url: 'https://api.map.baidu.com/geocoder/v2/?ak=IBMY12ukM2yorciPUoyKmlwy6io9IWcU&location=' + latitude + ',' + longitude + '&output=json',
              data: {},
              header: {
                'Content-Type': 'application/json'
              },
              success: function (gc) {
               //var prvince = res.data.result.addressComponent.province;
               // var district = res.data.result.addressComponent.district;
                var city = gc.data.result.addressComponent.city;
                that.setData({
                  city:city
                })
              }
            })
  },

  /*编辑自提地址信息 */
  editZtInfo: function(e){
    var id = e.currentTarget.dataset.name;
    var ztinfo = wx.getStorageSync('ztinfo');
    var ztArray = JSON.parse(ztinfo);
    for(var i=0;i<ztArray.length;i++){
      if (id == ztArray[i][0].id){
        this.setData({
          ztSingle:ztArray[i],
          showZtPop: true
        })
        console.log(ztArray[i]);
      }
    }
  },

  /*编辑数据库自提地址信息 */
  editDbZtInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    var ztid = e.currentTarget.dataset.ztid;
    var addressName = e.currentTarget.dataset.aname;
    var city = e.currentTarget.dataset.city;
    var addressInfo = e.currentTarget.dataset.ainfo;
    var ztSingle = new Array();
    ztSingle[0] = { 'id': ztid }
    ztSingle[1] = { 'info': addressInfo }
    ztSingle[2] = { 'city': city }
    ztSingle[3] = { 'addressName': addressName }
    ztSingle[4] = { 'checked': false }
      this.setData({
        ztSingle: ztSingle,
        showZtPop: true
      })
    console.log(ztSingle);
  },

  /* 选择自提项目后提交事件 */
  zitiSubmit:function(e){
    var that = this;
    var zt_id = e.detail.value.ztsub;
    if(zt_id != ''){
      var subData = app.globalData.subGoodsInfo;
      subData['zt'] = zt_id;
      app.globalData.subGoodsInfo = subData;
      //console.log(typeof(JSON.stringify(app.globalData.subGoodsInfo)));
      try {
        wx.setStorageSync('pubgoods', app.globalData.subGoodsInfo);
        console.log(app.globalData.subGoodsInfo);
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '自提信息设置完成！',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 0     //返回发布接龙信息页面
              })
            } 
          }
        })
      } catch (e) {
        console.log('没有加入缓存');
      }
    }else{
      console.log('没有接收到zt_id');
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function () {

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